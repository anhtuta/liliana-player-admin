import React, { PureComponent } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import InputText from '../../components/Input/InputText';
import InputFile from '../../components/Input/InputFile';
import Select from '../../components/Input/Select';
import SelectAsync from '../../components/Input/SelectAsync';
import NormalModal from '../../components/Modal/NormalModal';
import { ACTION_ADD, ACTION_EDIT, NO_LYRIC } from '../../constants/Constants';
import Toast from '../../components/Toast/Toast';
import PictureModal from './PictureModal';
import SongService from './SongService';
import SongZingItem from './SongZingItem';
import { cleanWithHyphen } from '../../service/utils';
import musicIcon from '../../assets/icons/music_icon.jpg';
import './SongUpsertModal.scss';

const TAB_UPLOAD_FILE = 'TAB_UPLOAD_FILE';
const TAB_ZING_MP3 = 'TAB_ZING_MP3';

class SongUpsertModal extends PureComponent {
  constructor(props) {
    super(props);
    const { id, title, artist, imageUrl, album, path, type, lyric, zing_id } = props.selectedRow;
    this.state = {
      tabKey: TAB_UPLOAD_FILE,
      id,
      title: title ? title : '',
      artist: artist ? artist : '',
      pictureBase64: null, // dùng cho ảnh được upload từ local
      imageUrl, // dùng cho ảnh của Zing
      album: album ? album : '',
      path: path ? path : '',
      type,
      lyric,
      zing_id,
      invalid: {
        title: false
      },
      file: null,
      fileName: '',
      lyricFileName: '',
      loading: false,
      uploadingMp3: false,
      uploadingLyric: false,
      removePicture: 0,
      showPictureModal: false,
      pictureUrl: null,
      pictureTitle: null
    };
    this.inputPicture = React.createRef();
    this.selectSongRef = React.createRef();
  }

  handleOnChange = (obj) => {
    const copyOfInvalid = { ...this.state.invalid, [obj.name]: obj.invalid };
    this.setState({
      [obj.name]: obj.value,
      invalid: copyOfInvalid
    });
  };

  handleOnChangeType = (obj) => {
    this.setState({
      type: { label: obj.label, value: obj.value }
    });
  };

  handleOnChangeTab = async (tabKey = '') => {
    // Note: phải use await nếu ko nó sẽ focus trước khi setState thực hiện xong,
    // mà chưa setState xong tức là chưa chuyển được tab, thì focus ko có tác dụng
    await this.setState({ tabKey: tabKey });
    this.selectSongRef.current.focus();
  };

  selectZingSong = ({ name = '', selected = {} }) => {
    console.log('selectZingSong', name, selected);
    if (!selected) selected = {};
    this.setState({
      title: selected.title ? selected.title : '',
      artist: selected.artistsNames ? selected.artistsNames : '',
      imageUrl: selected.thumbnailM ? selected.thumbnailM : null,
      album: selected.album ? selected.album.title : '',
      path: selected.title ? this.generatePath(selected.title, selected.artistsNames) : '',
      zing_id: selected.encodeId ? selected.encodeId : null
    });
  };

  /**
   * Send song to BE.
   * Note: nếu field nào đó, chẳng hạn album == null mà gửi cho BE
   * thì thằng Lumen nó sẽ convert thành album = 'null'.
   * Do đó những field ko require thì phải check nếu khác null mới gửi vào request body
   * @returns
   */
  onSave = () => {
    const {
      id,
      title,
      artist,
      pictureBase64,
      imageUrl,
      album,
      path,
      type,
      lyric,
      zing_id,
      file,
      removePicture
    } = this.state;
    const { action } = this.props;

    if (!title || !artist || !path || !type) {
      Toast.error('Please fill all required fields');
      return;
    }
    this.setState({ loading: true });

    let formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    if (pictureBase64) {
      formData.append('pictureBase64', pictureBase64.replace('data:', '').replace(/^.+,/, ''));
    }
    formData.append('path', path);

    if (album) formData.append('album', album);
    if (lyric) formData.append('lyric', lyric);

    if (action === ACTION_ADD) {
      this.setState({ uploadingMp3: true });
      formData.append('type', type.value);
      formData.append('file', file);
      if (zing_id) {
        formData.append('zing_id', zing_id);
        if (imageUrl) formData.append('imageUrl', imageUrl);
      }
      SongService.createSong(formData)
        .then((res) => {
          Toast.success(res.message);
          this.setState({ loading: false, uploadingMp3: false });
          this.props.onSave();
        })
        .catch((err) => {
          console.log(err);
          Toast.error(err);
          this.setState({ loading: false, uploadingMp3: false });
        });
    } else {
      formData.append('removePicture', removePicture);
      SongService.updateSong(id, formData)
        .then((res) => {
          Toast.success(res.message);
          this.setState({ loading: false });
          this.props.onSave();
        })
        .catch((err) => {
          console.log(err);
          this.setState({ loading: false });
          Toast.error(err);
        });
    }
  };

  fileTypes = ['.mp3'];
  loadMetadata = (file) => {
    let url = file.urn || file.name;
    window.ID3.loadTags(
      url,
      () => {
        const tags = window.ID3.getAllTags(url);
        const { title, artist, album } = tags;
        const path = this.generatePath(title, artist);
        let pictureBase64 = null;

        if ('picture' in tags) {
          const image = tags.picture;
          let base64String = '';
          for (let i = 0; i < image.data.length; i++) {
            base64String += String.fromCharCode(image.data[i]);
          }
          pictureBase64 = 'data:' + image.format + ';base64,' + window.btoa(base64String);
        }

        this.setState({ title, artist, pictureBase64, album, path, file });
      },
      {
        tags: [
          'artist',
          'title',
          'album',
          'year',
          'comment',
          'track',
          'genre',
          'lyrics',
          'picture'
        ],
        dataReader: window.FileAPIReader(file)
      }
    );
  };

  lyricFileTypes = ['.lrc', '.trc'];
  uploadLyric = (file) => {
    this.setState({ loading: true, uploadingLyric: true });
    let formData = new FormData();
    formData.append('file', file);
    SongService.uploadLyric(formData)
      .then((res) => {
        Toast.success(res.message);
        this.setState({
          loading: false,
          uploadingLyric: false,
          lyric: file.name
        });
      })
      .catch((err) => {
        console.log(err);
        Toast.error(err);
        this.setState({ loading: false, uploadingLyric: true });
      });
  };

  changePicture = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const pictureBase64 = reader.result;
      this.setState({
        pictureBase64,
        removePicture: 0
      });
    };
  };

  resetPicture = () => {
    this.setState({
      pictureBase64: null,
      imageUrl: null,
      removePicture: 1
    });
  };

  pictureFileTypes = ['.jpg', '.png', '.jpeg']; // ['image/*']

  displayPictureModal = (original) => {
    this.setState({
      showPictureModal: true,
      pictureUrl: original.url,
      pictureTitle: original.title + "'s picture"
    });
  };

  onClosePictureModal = () => {
    this.setState({
      showPictureModal: false,
      pictureUrl: null,
      pictureTitle: null
    });
  };

  resetPath = () => {
    const { title, artist } = this.state;
    const path = this.generatePath(title, artist);
    this.setState({ path });
  };

  // Note: khi update method này cũng phải update method phía BE
  generatePath = (title, artist) => {
    return cleanWithHyphen(title + ' ' + artist);
  };

  /**
   * @param {string} searchText
   * @returns Promise, và data của Promise này sẽ là 1 array các option dùng cho <Select />
   */
  fetchZingSong = async (searchText) => {
    const res = await SongService.searchZingSong(searchText);
    return res.data.data.items;
  };

  /**
   * obj chính là 1 phần tử của mảng options mà method fetchZingSong trả về
   * @param {object} obj
   */
  getOptionLabel = (obj) => {
    const { title, artistsNames, thumbnailM } = obj;
    return <SongZingItem title={title} artistsNames={artistsNames} thumbnailM={thumbnailM} />;
  };

  /**
   * obj chính là 1 phần tử của mảng options mà method fetchZingSong trả về
   * @param {object} obj
   */
  getOptionValue = (obj) => {
    return obj.encodeId;
  };

  updateZingLyric = async () => {
    const res = await SongService.updateZingLyric(this.props.selectedRow.zing_id);
    this.setState({ lyric: res.data });
    Toast.info('Re-download successfully! File saved: ' + res.data);
  };

  onClearLyric = () => {
    this.setState({ lyric: '' });
  };

  render() {
    const { showUpsertModal, onCloseUpsertModal, typeOptions, action } = this.props;
    const {
      tabKey,
      title,
      artist,
      pictureBase64,
      imageUrl,
      album,
      path,
      type,
      lyric,
      fileName,
      lyricFileName,
      loading,
      uploadingMp3,
      uploadingLyric,
      showPictureModal,
      pictureUrl,
      pictureTitle
    } = this.state;
    const modalTitle = action === ACTION_ADD ? 'Add new song' : 'Update song';
    const customItemStyles = {
      control: (base) => ({
        ...base,
        minHeight: 52
      })
    };
    const { zing_id } = this.props.selectedRow;

    return (
      <NormalModal
        customClass="song-upsert-modal"
        show={showUpsertModal}
        modalTitle={
          loading ? (
            <span className="uploading">
              <i className="fa fa-spinner fa-spin"></i> Wait me a second...
            </span>
          ) : (
            modalTitle
          )
        }
        saveButtonText="Save"
        cancelButtonText="Cancel"
        onSave={this.onSave}
        onClose={onCloseUpsertModal}
        onCancel={onCloseUpsertModal}
        disabledBtn={loading}
      >
        {action === ACTION_ADD && (
          <Tabs id="tab-add-song-type" activeKey={tabKey} onSelect={this.handleOnChangeTab}>
            <Tab eventKey={TAB_UPLOAD_FILE} title="Upload file" tabClassName="tab-upload-file">
              <InputFile
                onChange={this.loadMetadata}
                types={this.fileTypes}
                label="Please upload a mp3 file..."
                isRequire={true}
                fileName={fileName}
                uploading={uploadingMp3}
              />
            </Tab>
            <Tab eventKey={TAB_ZING_MP3} title="Zing Mp3" tabClassName="tab-zing-mp3">
              <SelectAsync
                name="selectZingSong"
                label="Select a song from Zing Mp3"
                placeholder="Search song"
                isRequire={true}
                onChange={this.selectZingSong}
                loadOptions={this.fetchZingSong}
                getOptionLabel={this.getOptionLabel}
                getOptionValue={this.getOptionValue}
                styles={customItemStyles}
                innerRef={this.selectSongRef}
              />
            </Tab>
          </Tabs>
        )}
        <div className="title-artist-picture">
          <div className="title-artist">
            <InputText
              name="title"
              label="Title"
              defaultValue={title}
              isRequire={true}
              onChange={this.handleOnChange}
            />
            <InputText
              name="artist"
              label="Artist"
              defaultValue={artist}
              isRequire={true}
              onChange={this.handleOnChange}
            />
          </div>
          <div className="picture">
            <input
              type="file"
              style={{ display: 'none' }}
              accept={this.pictureFileTypes.join(',')}
              ref={(node) => (this.inputPicture = node)}
              onChange={this.changePicture}
            />
            <img
              src={pictureBase64 ? pictureBase64 : imageUrl ? imageUrl : musicIcon}
              alt={`${title} (${artist})`}
              onClick={() => {
                const url = pictureBase64 ? pictureBase64 : imageUrl;
                if (url) {
                  this.displayPictureModal({ url, title });
                }
              }}
              style={{ cursor: pictureBase64 || imageUrl ? 'pointer' : 'default' }}
            />
            <div className="btn-wrapper">
              <i
                className="fa fa-pencil-square icon-btn-action icon-btn-edit"
                onClick={() => this.inputPicture.click()}
                title="Change picture"
              ></i>
              &nbsp;
              {(pictureBase64 || imageUrl) && (
                <i
                  className="fa fa-trash icon-btn-action icon-btn-delete"
                  onClick={this.resetPicture}
                  title="Delete picture"
                ></i>
              )}
            </div>
          </div>
        </div>
        <div className="album-path">
          <InputText
            name="album"
            label="Album"
            className="box-album"
            defaultValue={album}
            onChange={this.handleOnChange}
          />
          <div className="box-path">
            <InputText
              name="path"
              label="Path"
              className="input-path"
              defaultValue={path}
              isRequire={true}
              isReset={true}
              onReset={this.resetPath}
              onChange={this.handleOnChange}
            />
          </div>
        </div>
        <div className="type-lyric">
          <Select
            name="type"
            label="Type"
            className="box-select"
            defaultValue={type}
            options={typeOptions}
            isRequire={true}
            onChange={this.handleOnChangeType}
            isDisabled={action === ACTION_EDIT}
          />
          {!lyric &&
            (tabKey === TAB_ZING_MP3 ? (
              <InputText
                label={NO_LYRIC}
                className="box-lyric"
                defaultValue="Lyric will be downloaded automatically"
                disabled={true}
              />
            ) : (
              <InputFile
                onChange={this.uploadLyric}
                types={this.lyricFileTypes}
                label={NO_LYRIC}
                className="box-lyric"
                fileName={lyricFileName}
                uploading={uploadingLyric}
              />
            ))}
          {lyric && (
            <div className="box-lyric">
              <InputText
                label="Lyric"
                className="lyric-name"
                defaultValue={lyric}
                disabled={true}
                isReset={!!zing_id}
                isClear={true}
                titleReset="Re-download lyric from Zing"
                titleClear="Remove this lyric"
                onReset={this.updateZingLyric}
                onClear={this.onClearLyric}
              />
            </div>
          )}
        </div>

        {showPictureModal && (
          <PictureModal
            show={showPictureModal}
            pictureUrl={pictureUrl}
            pictureTitle={pictureTitle}
            onClose={this.onClosePictureModal}
          />
        )}
      </NormalModal>
    );
  }
}

export default SongUpsertModal;

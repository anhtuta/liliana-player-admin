import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
import FindLyricModal from './FindLyricModal';
import SongService from './SongService';
import SongZingItem from './SongZingItem';
import { cleanWithHyphen } from '../../service/utils';
import musicIcon from '../../assets/icons/music_icon.jpg';
import { SOY_OPTIONS } from './Song';
import './SongUpsertModal.scss';

const TAB_UPLOAD_FILE = 'TAB_UPLOAD_FILE';
const TAB_ZING_MP3 = 'TAB_ZING_MP3';

class SongUpsertModal extends PureComponent {
  constructor(props) {
    super(props);
    const { id, title, artist, image_url, soy, album, path, type, lyric, zing_id, file_name } =
      props.selectedRow;
    this.state = {
      tabKey: zing_id ? TAB_ZING_MP3 : TAB_UPLOAD_FILE,
      id,
      title: title || '',
      artist: artist || '',
      picture_base64: null, // dùng cho ảnh được upload từ local
      image_url, // dùng cho ảnh của Zing
      soy,
      album: album || '',
      path: path || '',
      type,
      lyric,
      zing_id: zing_id || '',
      invalid: {
        title: false
      },
      file: null,
      file_name: file_name || '',
      lyricFileName: '',
      loading: false,
      uploadingLyric: false,
      removePicture: 0,
      showPictureModal: false,
      showFindLyricModal: false,
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

  handleOnChangeSoy = (obj) => {
    this.setState({
      soy: { label: obj.label, value: obj.value }
    });
  };

  handleOnChangeType = (obj) => {
    this.setState({
      type: { label: obj.label, value: obj.value }
    });
  };

  handleOnChangeTab = async (tabKey = '') => {
    // Cần xoá file hoặc zing_id khi chọn source khác.
    // Note: dùng xoá zing_id, và sau đó state defaultValueZingItem = null, thì sau khi chọn lại cái tab
    // Zing Mp3 thì nó vẫn hiển thị song đó trên Select, bởi vì defaultValue chỉ là initValue,
    // nên khi props này thay đổi thì component SelectAsync ở dưới vẫn không re-render lại. Kệ nó!
    if (tabKey === TAB_UPLOAD_FILE) {
      this.setState({
        zing_id: ''
      });
    } else if (tabKey === TAB_ZING_MP3) {
      this.setState({
        file: null
      });
    }

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
      image_url: selected.thumbnailM ? selected.thumbnailM : null,
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
      picture_base64,
      image_url,
      soy,
      album,
      path,
      type,
      lyric,
      zing_id,
      file,
      removePicture
    } = this.state;
    const { action, onSave } = this.props;

    if (!title || !artist || !path || !type) {
      Toast.error('Please fill all required fields');
      return;
    }
    this.setState({ loading: true });

    let formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    if (picture_base64) {
      formData.append('picture_base64', picture_base64.replace('data:', '').replace(/^.+,/, ''));
    }
    formData.append('path', path);

    if (soy?.value) formData.append('song_of_the_year', soy.value);
    // Nếu muốn truyền null: phải delete key đó nếu ko nó sẽ gửi sang backend string 'null'
    // Ref: https://stackoverflow.com/a/62303327/7688028
    else formData.delete('song_of_the_year');
    if (album) formData.append('album', album);
    if (lyric) formData.append('lyric', lyric);

    if (zing_id) {
      formData.append('zing_id', zing_id);
      if (image_url) formData.append('image_url', image_url);
    } else {
      formData.append('file', file);
    }

    if (action === ACTION_ADD) {
      formData.append('type', type.value);
      SongService.createSong(formData)
        .then((res) => {
          this.setState({ loading: false });
          Toast.success(res.message);
          onSave();
        })
        .catch((err) => {
          this.setState({ loading: false });
          Toast.error(err);
        });
    } else {
      formData.append('removePicture', removePicture);
      SongService.updateSong(id, formData)
        .then((res) => {
          this.setState({ loading: false });
          Toast.success(res.message);
          onSave();
        })
        .catch((err) => {
          this.setState({ loading: false });
          Toast.error(err);
        });
    }
    // DO NOT set outside of then,catch, because this statement will be execute
    // before then and catch due to those methods are async.
    // Note: this case should use async, await to avoid setState loading too many places,
    // and we can set it here at the end
    // this.setState({ loading: false });
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
        let picture_base64 = null;

        if ('picture' in tags) {
          const image = tags.picture;
          let base64String = '';
          for (const element of image.data) {
            base64String += String.fromCharCode(element);
          }
          picture_base64 = 'data:' + image.format + ';base64,' + window.btoa(base64String);
        }

        this.setState({ title, artist, picture_base64, album, path, file });
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
        Toast.error(err);
        this.setState({ loading: false, uploadingLyric: false });
      });
  };

  changePicture = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const picture_base64 = reader.result;
      this.setState({
        picture_base64,
        removePicture: 0
      });
    };
  };

  resetPicture = () => {
    this.setState({
      picture_base64: null,
      image_url: null,
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
    if (res.data) {
      this.setState({ lyric: res.data });
      Toast.info('Re-download successfully! File saved: ' + res.data);
    } else {
      Toast.warn("Zing doesn't have lyric for this song, nothing changed!");
    }
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
      picture_base64,
      image_url,
      zing_id,
      soy,
      album,
      path,
      type,
      lyric,
      file_name,
      lyricFileName,
      loading,
      uploadingLyric,
      showPictureModal,
      showFindLyricModal,
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
    const btnFindLyric = (
      <i
        className="fa fa-eye icon-btn-action icon-btn-edit btn-find-file"
        onClick={() => this.setState({ showFindLyricModal: true })}
        title={'Select available lyrics'}
      ></i>
    );
    const defaultValueZingItem = zing_id
      ? {
          title,
          artistsNames: artist,
          thumbnailM: image_url,
          zing_id
        }
      : null;

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
        <div className="source-of-song">
          <h5>
            Source of song{' '}
            <i
              className="fa fa-info-circle source-info"
              aria-hidden="true"
              title="NOTE 1: only allow single source. If you Zing, it will remove the existed mp3 file.
              NOTE 2: if lyric existed, then it will be kept (NOT re-download lyric from Zing).
              NOTE 3: if you want to re-download lyric, use below button"
            ></i>
          </h5>
          <Tabs id="tab-add-song-type" activeKey={tabKey} onSelect={this.handleOnChangeTab}>
            <Tab eventKey={TAB_UPLOAD_FILE} title="Upload file" tabClassName="tab-upload-file">
              <InputFile
                onChange={this.loadMetadata}
                types={this.fileTypes}
                label="Please upload a mp3 file..."
                isRequire={true}
                fileName={file_name}
                uploading={loading}
              />
            </Tab>
            <Tab eventKey={TAB_ZING_MP3} title="Zing Mp3" tabClassName="tab-zing-mp3">
              <SelectAsync
                name="selectZingSong"
                defaultValue={defaultValueZingItem}
                label={`Search and select a song from Zing Mp3 (${zing_id})`}
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
        </div>
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
              src={picture_base64 || image_url || musicIcon}
              alt={`${title} (${artist})`}
              onClick={() => {
                const url = picture_base64 || image_url;
                if (url) {
                  this.displayPictureModal({ url, title });
                }
              }}
              style={{ cursor: picture_base64 || image_url ? 'pointer' : 'default' }}
            />
            <div className="btn-wrapper">
              <i
                className="fa fa-pencil-square icon-btn-action icon-btn-edit"
                onClick={() => this.inputPicture.click()}
                title="Change picture"
              ></i>
              &nbsp;
              {(picture_base64 || image_url) && (
                <i
                  className="fa fa-trash icon-btn-action icon-btn-delete"
                  onClick={this.resetPicture}
                  title="Delete picture"
                ></i>
              )}
            </div>
          </div>
        </div>
        <div>
          <Select
            name="song_of_the_year"
            label="Song of the year"
            className="box-select"
            defaultValue={soy}
            options={SOY_OPTIONS}
            onChange={this.handleOnChangeSoy}
          />
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
              <div className="box-lyric">
                <div className="input-lyric">
                  <InputText
                    label={NO_LYRIC}
                    className="lyric-name"
                    defaultValue="Lyric will be downloaded automatically"
                    disabled={true}
                  />
                </div>
              </div>
            ) : (
              <div className="box-lyric">
                <div className="input-lyric">
                  <InputFile
                    onChange={this.uploadLyric}
                    types={this.lyricFileTypes}
                    label={NO_LYRIC}
                    className="lyric-name"
                    fileName={lyricFileName}
                    uploading={uploadingLyric}
                  />
                </div>
                {btnFindLyric}
              </div>
            ))}
          {lyric && (
            <div className="box-lyric">
              <div className="input-lyric">
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
              {btnFindLyric}
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

        {showFindLyricModal && (
          <FindLyricModal
            show={showFindLyricModal}
            onClose={() => this.setState({ showFindLyricModal: false })}
            onChooseFile={(filename) => this.setState({ lyric: filename })}
          />
        )}
      </NormalModal>
    );
  }
}

SongUpsertModal.propTypes = {
  showUpsertModal: PropTypes.bool.isRequired,
  onCloseUpsertModal: PropTypes.func.isRequired,
  typeOptions: PropTypes.array.isRequired,
  selectedRow: PropTypes.object.isRequired,
  action: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired
};

export default SongUpsertModal;

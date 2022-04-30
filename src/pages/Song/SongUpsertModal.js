import React, { PureComponent } from 'react';
import InputText from '../../components/Input/InputText';
import InputFile from '../../components/Input/InputFile';
import Select from '../../components/Input/Select';
import BoxInfo from '../../components/Input/BoxInfo';
import Button from '../../components/Button/Button';
import NormalModal from '../../components/Modal/NormalModal';
import { ACTION_ADD, ACTION_EDIT, NO_LYRIC } from '../../constants/Constants';
import Toast from '../../components/Toast/Toast';
import PictureModal from './PictureModal';
import SongService from './SongService';
import musicIcon from '../../assets/icons/music_icon.jpg';
import './SongUpsertModal.scss';

class SongUpsertModal extends PureComponent {
  constructor(props) {
    super(props);
    const { id, title, artist, imageUrl, album, path, type, lyric } = props.selectedRow;
    this.state = {
      id,
      title: title ? title : '',
      artist: artist ? artist : '',
      pictureBase64: null,
      imageUrl,
      album: album ? album : '',
      path: path ? path : '',
      type,
      lyric,
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
      showUploadLyric: !lyric,
      pictureUrl: null,
      pictureTitle: null
    };
    this.inputPicture = React.createRef();
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

  /**
   * Send song to BE.
   * Note: nếu field nào đó, chẳng hạn album == null mà gửi cho BE
   * thì thằng Lumen nó sẽ convert thành album = 'null'.
   * Do đó những field ko require thì phải check nếu khác null mới gửi vào request body
   * @returns
   */
  onSave = () => {
    const { id, title, artist, pictureBase64, album, path, type, lyric, file, removePicture } =
      this.state;
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
          // showUploadLyric: false,
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

  generatePath = (title, artist) => {
    return (title + ' ' + artist)
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[?,]+/g, '')
      .replace(/[-]+/g, '-');
  };

  render() {
    const { showUpsertModal, onCloseUpsertModal, typeOptions, action } = this.props;
    const {
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
      showUploadLyric,
      pictureUrl,
      pictureTitle
    } = this.state;

    return (
      <NormalModal
        customClass="song-upsert-modal"
        show={showUpsertModal}
        modalTitle={
          loading ? (
            <span className="uploading">
              <i className="fa fa-spinner fa-spin"></i> Wait me a second...
            </span>
          ) : action === ACTION_ADD ? (
            'Add new song'
          ) : (
            'Update song'
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
          <InputFile
            onChange={this.loadMetadata}
            types={this.fileTypes}
            label="Please upload a mp3 file..."
            isRequire={true}
            fileName={fileName}
            uploading={uploadingMp3}
          />
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
            className="input-album"
            defaultValue={album}
            onChange={this.handleOnChange}
          />
          <div className="path-wrapper">
            <InputText
              name="path"
              label="Path"
              className="input-path"
              defaultValue={path}
              isRequire={true}
              onChange={this.handleOnChange}
            />
            <div className="btn-reset-path">
              <Button text="Default" onClick={this.resetPath} />
            </div>
          </div>
        </div>
        <div className="type-lyric">
          <Select
            name="type"
            label="Type"
            className="select-type"
            defaultValue={type}
            options={typeOptions}
            isRequire={true}
            onChange={this.handleOnChangeType}
            isDisabled={action === ACTION_EDIT}
          />
          {showUploadLyric && (
            <InputFile
              onChange={this.uploadLyric}
              types={this.lyricFileTypes}
              label={NO_LYRIC}
              className="input-lyric"
              fileName={lyricFileName}
              uploading={uploadingLyric}
            />
          )}
          {!showUploadLyric && (
            <div className="download-lyric">
              <BoxInfo label="Lyric">
                {lyric ? (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={process.env.REACT_APP_HOST_API + '/api/lyric/download?file=' + lyric}
                  >
                    {lyric}
                  </a>
                ) : (
                  NO_LYRIC
                )}
              </BoxInfo>
              <i
                className="fa fa-upload icon-btn-action icon-btn-edit"
                onClick={() => this.setState({ showUploadLyric: true })}
                title="Upload new lyric"
              ></i>
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

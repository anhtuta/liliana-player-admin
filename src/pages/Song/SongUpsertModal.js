import React, { PureComponent } from 'react';
import InputText from '../../components/Input/InputText';
import InputFile from '../../components/Input/InputFile';
import Select from '../../components/Input/Select';
import NormalModal from '../../components/Modal/NormalModal';
import { ACTION_ADD } from '../../constants/Constants';
import Toast from '../../components/Toast/Toast';
import SongService from './SongService';
import musicIcon from '../../assets/icons/music_icon.jpg';

class SongUpsertModal extends PureComponent {
  constructor(props) {
    super(props);
    const { id, title, artist, type } = props.selectedRow;
    this.state = {
      id,
      title,
      artist,
      pictureBase64: null,
      imageFormat: '',
      album: '',
      type,
      invalid: {
        title: false
      },
      file: null,
      fileName: '',
      loading: false
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

  onSave = () => {
    const { id, title, artist, pictureBase64, album, type, file } = this.state;
    if (!title || !artist || !type) {
      Toast.error('Please fill all required fields');
      return;
    }
    this.setState({ loading: true });
    let formData = new FormData();
    formData.append('id', id);
    formData.append('title', title);
    formData.append('artist', artist);
    if (pictureBase64) formData.append('pictureBase64', pictureBase64);
    formData.append('album', album);
    formData.append('type', type.value);
    formData.append('file', file);
    // const data = {
    //   id,
    //   title,
    //   artist,
    //   pictureBase64,
    //   album,
    //   type: type.value,
    //   file
    // };
    // console.log('data: ', data);
    const { action } = this.props;
    if (action === ACTION_ADD) {
      SongService.createSong(formData)
        .then((res) => {
          Toast.success(res.message);
          this.setState({ loading: false });
          this.props.onSave();
        })
        .catch((err) => {
          console.log(err);
          Toast.error(err);
          this.setState({ loading: false });
        });
    }
    // else {
    //   SongService.updateSong(data)
    //     .then((res) => {
    //       Toast.success(res.message);
    //       this.props.onSave();
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       Toast.error(err);
    //     });
    // }
  };

  fileTypes = ['.mp3'];
  loadMetadata = (file) => {
    let url = file.urn || file.name;
    let imageFormat = '';
    window.ID3.loadTags(
      url,
      () => {
        const tags = window.ID3.getAllTags(url);
        const { title, artist, album } = tags;
        let pictureBase64 = null;

        if ('picture' in tags) {
          const image = tags.picture;
          let base64String = '';
          for (let i = 0; i < image.data.length; i++) {
            base64String += String.fromCharCode(image.data[i]);
          }
          pictureBase64 = window.btoa(base64String);
          imageFormat = image.format;
        }

        this.setState({ title, artist, pictureBase64, imageFormat, album, file });
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

  changePicture = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const pictureBase64 = reader.result.replace('data:', '').replace(/^.+,/, '');
      this.setState({
        pictureBase64
      })
    };
  };

  resetPicture = () => {
    this.setState({
      pictureBase64: null
    })
  };

  pictureFileTypes = ['.jpg', '.png', '.jpeg'];  // ['image/*']
  savePicture = () => {};

  render() {
    const { showUpsertModal, onCloseUpsertModal, typeOptions } = this.props;
    const {
      title,
      artist,
      pictureBase64,
      imageFormat,
      album,
      type,
      fileName,
      loading
    } = this.state;

    return (
      <NormalModal
        customClass="song-upsert-modal"
        show={showUpsertModal}
        modalTitle="Add new song"
        saveButtonText="Save"
        cancelButtonText="Cancel"
        onSave={this.onSave}
        onClose={onCloseUpsertModal}
        onCancel={onCloseUpsertModal}
        disabledBtn={loading}
      >
        <InputFile
          onChange={this.loadMetadata}
          types={this.fileTypes}
          label="Please upload a mp3 file..."
          isRequire={true}
          fileName={fileName}
        />
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
              src={
                pictureBase64
                  ? 'data:' + imageFormat + ';base64,' + pictureBase64
                  : musicIcon
              }
            />
            <div className="btn-wrapper">
              <i
                className="fas fa-edit icon-btn-action icon-btn-edit"
                onClick={() => this.inputPicture.click()}
                title="Change picture"
              ></i>
              &nbsp;
              {pictureBase64 && (
                <i
                  className="fas fa-trash-alt icon-btn-action icon-btn-delete"
                  onClick={this.resetPicture}
                  title="Delete picture"
                ></i>
              )}
            </div>
          </div>
        </div>
        <InputText
          name="album"
          label="Album"
          defaultValue={album}
          onChange={this.handleOnChange}
        />
        <Select
          name="type"
          label="Type"
          defaultOption={type}
          options={typeOptions}
          isRequire={true}
          onChange={this.handleOnChangeType}
        />
      </NormalModal>
    );
  }
}

export default SongUpsertModal;

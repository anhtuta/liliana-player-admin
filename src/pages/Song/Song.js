import React, { PureComponent } from 'react';
import Moment from 'react-moment';
import Table from '../../components/Table/Table';
import SearchBox from '../../components/Input/SearchBox';
import Button from '../../components/Button/Button';
import { ACTION_ADD, ACTION_EDIT, NO_LYRIC } from '../../constants/Constants';
import SongUpsertModal from './SongUpsertModal';
import PictureModal from './PictureModal';
import Toast from '../../components/Toast/Toast';
import ConfirmModal from '../../components/Modal/ConfirmModal';
import SongService from './SongService';
import musicIcon from '../../assets/icons/music_icon.jpg';
import './Song.scss';

class Song extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      songData: {},
      params: {
        page: 0
      },
      loading: false,
      action: '',
      showUpsertModal: false,
      showConfirmModal: false,
      showPictureModal: false,
      typeOptions: [],
      selectedRow: {},
      pictureUrl: null,
      pictureTitle: null
    };

    this.columns = [
      {
        Header: 'Song',
        accessor: 'title',
        Cell: ({ original }) => {
          return (
            <div className="td-song-info">
              <img
                className="song-picture"
                src={
                  original.imageUrl ? process.env.REACT_APP_HOST_API + original.imageUrl : musicIcon
                }
                alt=""
                onClick={() => {
                  if (original.imageUrl) this.displayPictureModal(original);
                }}
                style={{ cursor: original.imageUrl ? 'pointer' : 'default' }}
              />
              <div className="song-item">
                <div className="song-title">{original.title}</div>
                <div className="song-artist">{original.artist}</div>
                <div className="song-album">({original.album})</div>
                <div className="song-extra-info">
                  <span title={`Listens: ${original.listens}`}>({original.listens}) </span>
                  <span title={`Type: ${original.type}`}>({original.type})</span>
                </div>
              </div>
            </div>
          );
        },
        minWidth: 220
      },
      {
        Header: 'Path',
        accessor: 'path'
      },
      {
        Header: 'Lyric',
        accessor: 'lyric',
        Cell: ({ original }) => (
          <span
            style={{
              fontWeight: original.lyric && original.lyric.endsWith('.trc') ? 'bold' : ''
            }}
            title={original.lyric}
          >
            {original.lyric ? original.lyric : NO_LYRIC}
          </span>
        )
      },
      {
        Header: 'Created date',
        accessor: 'created_date',
        Cell: ({ original }) => <Moment format="HH:mm DD/MM/YYYY">{original.created_date}</Moment>
      },
      {
        Header: 'Updated date',
        accessor: 'updated_at',
        Cell: ({ original }) => <Moment format="HH:mm DD/MM/YYYY">{original.updated_at}</Moment>
      },
      {
        Header: 'Action',
        Cell: ({ original }) => (
          <div>
            <i
              className="fas fa-edit icon-btn-action icon-btn-edit"
              onClick={() => this.onUpdate(original)}
            ></i>
            &nbsp;
            <i
              className="fas fa-trash-alt icon-btn-action icon-btn-delete"
              onClick={() => this.onDelete(original)}
            ></i>
          </div>
        ),
        width: 80
      }
    ];
  }

  displayPictureModal = (original) => {
    this.setState({
      showPictureModal: true,
      pictureUrl: process.env.REACT_APP_HOST_API + original.imageUrl,
      pictureTitle: original.title + "'s picture"
    });
  };

  componentDidMount() {
    // get all type for creating new or updating song
    SongService.getAllTypes()
      .then((res) => {
        const typeOptions = res.map((item) => ({
          value: item.type,
          label: item.type
        }));
        this.setState({ typeOptions });
      })
      .catch((err) => {
        console.log(err);
        Toast.error(err);
      });
  }

  getSongs = (params) => {
    this.setState({ loading: true });
    const sort = params.sortBy ? params.sortBy + ',' + params.sortOrder : this.state.params.sort;
    const newParams = {
      ...this.state.params,
      ...params,
      sort
    };
    this.setState({
      params: newParams
    });
    const lumenParams = {
      ...newParams,
      page: newParams.page + 1 // Because Lumen start page is index 1
    };
    SongService.getSongs(lumenParams)
      .then((res) => {
        this.setState({
          songData: {
            list: res.data,
            totalPages: res.last_page
          },
          totalCount: res.total,
          loading: false
        });
      })
      .catch((err) => {
        console.log(err);
        Toast.error(err);
        this.setState({
          loading: false
        });
      });
  };

  onSearch = (obj) => {
    this.getSongs({ searchText: obj.value });
  };

  onAddNew = () => {
    this.setState({
      action: ACTION_ADD,
      showUpsertModal: true
    });
  };

  getTypeOption = (name) => {
    return this.state.typeOptions.find((option) => {
      return option.value === name;
    });
  };

  onUpdate = (original) => {
    const selectedRow = {
      id: original.id,
      title: original.title,
      artist: original.artist,
      imageUrl: original.imageUrl ? process.env.REACT_APP_HOST_API + original.imageUrl : null,
      album: original.album,
      path: original.path,
      type: this.getTypeOption(original.type),
      lyric: original.lyric
    };
    this.setState({
      action: ACTION_EDIT,
      showUpsertModal: true,
      selectedRow
    });
  };

  onDelete = (original) => {
    this.setState({
      showConfirmModal: true,
      selectedRow: { id: original.id, title: original.title }
    });
  };

  onCloseUpsertModal = () => {
    this.setState({
      showUpsertModal: false,
      selectedRow: {}
    });
  };

  onCloseConfirmModal = () => {
    this.setState({
      showConfirmModal: false,
      selectedRow: {}
    });
  };

  onClosePictureModal = () => {
    this.setState({
      showPictureModal: false,
      pictureUrl: null,
      pictureTitle: null
    });
  };

  onSave = () => {
    this.onCloseUpsertModal();
    this.getSongs(this.state.params);
  };

  onDeleteSong = () => {
    SongService.deleteSong(this.state.selectedRow.id)
      .then((res) => {
        Toast.success(res.message);
        this.onCloseConfirmModal();
        this.getSongs(this.state.params);
      })
      .catch((err) => {
        console.log(err);
        Toast.error(err);
      });
  };

  render() {
    const {
      songData,
      loading,
      showUpsertModal,
      showConfirmModal,
      showPictureModal,
      typeOptions,
      action,
      selectedRow,
      pictureUrl,
      pictureTitle
    } = this.state;

    return (
      <div className="song-wrapper">
        <h2>All song</h2>
        <div className="search-section">
          <div className="width50">
            <SearchBox name="searchText" onSearch={this.onSearch} />
          </div>
          <Button text="Add new" className="btn-success btn-add-new" onClick={this.onAddNew} />
        </div>

        <Table
          columns={this.columns}
          data={songData}
          loading={loading}
          onFetchData={this.getSongs}
          className="song-table"
          defaultPageSize={10}
        />

        {showUpsertModal && (
          <SongUpsertModal
            showUpsertModal={showUpsertModal}
            onCloseUpsertModal={this.onCloseUpsertModal}
            typeOptions={typeOptions}
            selectedRow={selectedRow}
            action={action}
            onSave={this.onSave}
          />
        )}
        {showConfirmModal && (
          <ConfirmModal
            show={showConfirmModal}
            modalTitle={`Delete this song "${selectedRow.title}", this cannot be undone?`}
            saveButtonText="Delete"
            cancelButtonText="Cancel"
            isDelete={true}
            onSave={this.onDeleteSong}
            onClose={this.onCloseConfirmModal}
            onCancel={this.onCloseConfirmModal}
          />
        )}
        {showPictureModal && (
          <PictureModal
            show={showPictureModal}
            pictureUrl={pictureUrl}
            pictureTitle={pictureTitle}
            onClose={this.onClosePictureModal}
          />
        )}
      </div>
    );
  }
}

export default Song;

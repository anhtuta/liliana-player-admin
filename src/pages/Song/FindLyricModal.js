import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import SearchBox from '../../components/Input/SearchBox';
import NormalModal from '../../components/Modal/NormalModal';
import Table from '../../components/Table/Table';
import { fileSizeSI } from '../../service/utils';
import LyricService from './LyricService';
import Button from '../../components/Button/Button';
import './FindLyricModal.scss';

export default function FindLyricModal({ show, onClose, onChooseFile }) {
  const [lyricFiles, setLyricFiles] = useState({}); // data for table
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      Header: 'No.',
      Cell: ({ index }) => index + 1,
      width: 50
    },
    {
      Header: 'File name',
      accessor: 'name',
      minWidth: 300
    },
    {
      Header: 'Date modified',
      accessor: 'last_modified',
      Cell: ({ original }) => (
        <Moment format="DD/MM/YYYY HH:mm">{original.last_modified * 1000}</Moment>
      ),
      minWidth: 150
    },
    {
      Header: 'Size',
      accessor: 'size',
      Cell: ({ original }) => fileSizeSI(original.size)
    },
    {
      Header: 'Action',
      Cell: ({ original }) => (
        <Button
          type={'solid-button'}
          className={'btn-success'}
          onClick={() => {
            onChooseFile(original.name);
            onClose();
          }}
          text="Choose"
        />
      )
    }
  ];

  useEffect(() => {
    searchLyricFile();
  }, []);

  const searchLyricFile = async (params) => {
    setLoading(true);
    try {
      const res = await LyricService.searchLyricFile({ name: params?.name });
      setLyricFiles({
        list: res?.data,
        totalPages: 1
      });
      setTotal(res?.meta?.total || 0);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const onSearch = (obj) => {
    searchLyricFile({ name: obj.value });
  };

  return (
    <NormalModal
      customClass="find-lyric-modal"
      show={show}
      backdrop={true}
      modalTitle={`All lyric files (${total})`}
      saveButtonText="Okay"
      onSave={onClose}
      onClose={onClose}
    >
      <SearchBox name="name" onSearch={onSearch} />
      <div className="table-wrapper">
        <Table
          className="find-lyric-table"
          columns={columns}
          data={lyricFiles}
          showPagination={false}
          loading={loading}
          onFetchData={searchLyricFile}
          defaultPageSize={10}
        />
      </div>
    </NormalModal>
  );
}

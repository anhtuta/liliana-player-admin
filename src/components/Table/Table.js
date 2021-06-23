import React from 'react';
import ReactTable from 'react-table-v6';
import PropTypes from 'prop-types';
import 'react-table-v6/react-table.css';
import './Table.scss';

const DEFAULT_PAGE_SIZE = 20;

const Table = (props) => {
  const onFetchData = (state) => {
    const { page, pageSize, sorted } = state;
    const params = {
      page,
      size: pageSize,
      sortBy: sorted.length > 0 ? sorted[0].id : null,
      sortOrder: sorted.length > 0 ? (sorted[0].desc ? 'desc' : 'asc') : null
    };
    if (props.onFetchData) props.onFetchData(params);
  };

  const {
    columns,
    data,
    className,
    defaultPageSize,
    loading,
    showPagination = true
  } = props;
  const pages = data.totalPages;
  const defaultProps = {
    manual: true,
    defaultPageSize: defaultPageSize ? defaultPageSize : DEFAULT_PAGE_SIZE,
    pageSizeOptions: [5, 10, 20, 25, 50, 100],
    resizable: true
  };

  const dynamicProps = {
    className: `-striped -highlight ${className ? className : ''}`,
    showPagination: pages > 0 && showPagination,
    onFetchData,
    columns,
    data: data.list,
    pages,
    loading
  };

  const nestedProps = { ...defaultProps, ...dynamicProps };

  return <ReactTable {...nestedProps} />;
};

Table.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  onFetchData: PropTypes.func
};

/*
Note: props.data must contains "list" and "totalPages", for example:
props.data = {
  "list" : [
    {
    "id" : 1,
    "title" : "Những tháng năm rực rỡ",
    "author" : "Ae-ran Kim"
   },
   {
    "id" : 2,
    "title" : "21 bài học cho thế kỉ 21",
    "author" : "Yuval Noah Harari"
  }],
  "totalPages" : 2
}
*/
export default Table;

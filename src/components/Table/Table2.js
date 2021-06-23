import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table-v6';
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
    props.onFetchData(params);
  };

  const { columns, className, defaultPageSize, data, pages, loading } = props;

  const defaultProps = {
    manual: true,
    defaultPageSize: defaultPageSize ? defaultPageSize : DEFAULT_PAGE_SIZE,
    minRows: defaultPageSize ? defaultPageSize : DEFAULT_PAGE_SIZE,
    pageSizeOptions: [5, 10, 20, 25, 50, 100],
    resizable: true
  };

  const dynamicProps = {
    className: `-striped -highlight ${className ? className : ''}`,
    showPagination: pages > 0,
    onFetchData,
    columns,
    data,
    pages,
    loading
  };

  const nestedProps = { ...defaultProps, ...dynamicProps };

  return <ReactTable {...nestedProps} />;
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  onFetchData: PropTypes.func.isRequired, // this method will return a Promise
  className: PropTypes.string
};

export default Table;

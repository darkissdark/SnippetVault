'use client';

import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination">
      <ReactPaginate
        pageCount={totalPages}
        forcePage={page - 1}
        onPageChange={({ selected }) => onPageChange(selected + 1)}
        containerClassName={styles.pagination}
        pageClassName={styles.page}
        pageLinkClassName={styles.pageLink}
        activeClassName={styles.active}
        previousClassName={styles.page}
        nextClassName={styles.page}
        previousLinkClassName={styles.pageLink}
        nextLinkClassName={styles.pageLink}
        breakClassName={styles.page}
        breakLinkClassName={styles.pageLink}
        disabledClassName={styles.disabled}
        previousLabel="<"
        nextLabel=">"
        breakLabel="..."
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        hrefBuilder={(pageNumber) => `?page=${pageNumber}`}
      />
    </nav>
  );
}

import { Button, ButtonGroup } from 'react-bootstrap';

interface PaginationControlsProps {
  currentPage: number;
  onPrev: () => void;
  onNext: () => void;
  totalItems: number;
  rowsPerPage?: number;
}

const PaginationControls = ({
  currentPage,
  onPrev,
  onNext,
  totalItems,
  rowsPerPage = 10
}: PaginationControlsProps) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div className="d-flex justify-content-between align-items-center my-3">
      <span>
        Showing {startItem}-{endItem} of {totalItems} items
      </span>
      <ButtonGroup>
        <Button
          variant="outline-primary"
          onClick={onPrev}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline-primary"
          onClick={onNext}
          disabled={currentPage >= totalPages || totalItems <= rowsPerPage}
        >
          Next
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default PaginationControls;
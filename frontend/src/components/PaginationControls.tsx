import { Button, ButtonGroup } from 'react-bootstrap';

interface PaginationControlsProps {
  currentPage: number;
  onPrev: () => void;
  onNext: () => void;
  dataLength: number;
  rowsPerPage?: number;
}

const PaginationControls = ({
  currentPage,
  onPrev,
  onNext,
  dataLength,
  rowsPerPage = 10
}: PaginationControlsProps) => {
  const totalPages = Math.ceil(dataLength / rowsPerPage);

  return (
    <div className="d-flex justify-content-between align-items-center my-3">
      <span>Page {currentPage} of {totalPages}</span>
      <ButtonGroup>
        <Button
          variant="outline-primary"
          onClick={onPrev}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline-primary"
          onClick={onNext}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default PaginationControls;
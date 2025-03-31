import { Table } from 'react-bootstrap';
import PaginationControls from '../components/PaginationControls';
import ErrorDisplay from '../components/ErrorDisplay';

interface InventoryProps {
  data: any[];
  currentPage: number;
  onPageChange: (direction: 'next' | 'prev') => void;
  totalItems: number;
}

const Inventory = ({ data, currentPage, onPageChange, totalItems }: InventoryProps) => {
  const validateItem = (item: any) => {
    const errors: string[] = [];
    
    if (item["Stock On"] === 0) errors.push("Stock On is zero");
    if (item["Stock On"] < 0) errors.push("Stock On is negative");
    if (!item["Item Code"] || item["Item Code"] === "ITM999") errors.push("Invalid Item Code");
    
    return errors;
  };

  return (
    <div>
      <h3 className="mb-4">Inventory Stock</h3>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Item Description</th>
            <th>Stock On</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const errors = validateItem(item);
            return (
              <tr key={`inv-${index}`} className={errors.length ? 'error-row' : ''}>
                <td>{item["Item Code"]}</td>
                <td>{item["Item Description"]}</td>
                <td>{item["Stock On"]}</td>
                <td>
                  <ErrorDisplay errors={errors} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <PaginationControls
        currentPage={currentPage}
        onPrev={() => onPageChange('prev')}
        onNext={() => onPageChange('next')}
        totalItems={totalItems}
      />
    </div>
  );
};

export default Inventory;
import { Table } from 'react-bootstrap';
import PaginationControls from '../components/PaginationControls';
import ErrorDisplay from '../components/ErrorDisplay';

interface ProductionOrdersProps {
  dataLM: any[];
  dataMS: any[];
  currentPageLM: number;
  currentPageMS: number;
  onPageChange: (key: 'LM' | 'MS', direction: 'next' | 'prev') => void;
}

const ProductionOrders = ({
  dataLM,
  dataMS,
  currentPageLM,
  currentPageMS,
  onPageChange
}: ProductionOrdersProps) => {
  const validateItem = (item: any) => {
    const errors: string[] = [];
    
    if (!item["Prod No"]) errors.push("Missing Production Number");
    if (!item["Product No."]) errors.push("Missing Product Number");
    if (item["Production Qty"] <= 0) errors.push("Invalid Production Quantity");
    if (!item["Rate"]) errors.push("Missing Rate");
    if (item["Rate"] <= 0) errors.push("Invalid Rate");
    if (item["Total WIP Value"] < 0||!item["Total WIP Value"]) errors.push("Invalid WIP Value");

    return errors;
  };

  return (
    <div>
      <h3 className="mb-4">Production Orders - LM</h3>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>Prod No</th>
            <th>Product No.</th>
            <th>Production Qty</th>
            <th>Rate</th>
            <th>Total WIP Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dataLM.map((item, index) => {
            const errors = validateItem(item);
            return (
              <tr key={`lm-row-${index}`} className={errors.length ? 'error-row' : ''}>
                <td>{item["Prod No"]}</td>
                <td>{item["Product No."]}</td>
                <td>{item["Production Qty"]}</td>
                <td>{item["Rate"]}</td>
                <td>{item["Total WIP Value"]}</td>
                <td>
                  <ErrorDisplay errors={errors} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <PaginationControls
        currentPage={currentPageLM}
        onPrev={() => onPageChange('LM', 'prev')}
        onNext={() => onPageChange('LM', 'next')}
        dataLength={dataLM.length}
      />

      <h3 className="mb-4 mt-5">Production Orders - MS</h3>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>Prod No</th>
            <th>Product No.</th>
            <th>Production Qty</th>
            <th>Rate</th>
            <th>Total WIP Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dataMS.map((item, index) => {
            const errors = validateItem(item);
            return (
              <tr key={`ms-row-${index}`} className={errors.length ? 'error-row' : ''}>
                <td>{item["Prod No"]}</td>
                <td>{item["Product No."]}</td>
                <td>{item["Production Qty"]}</td>
                <td>{item["Rate"]}</td>
                <td>{item["Total WIP Value"]}</td>
                <td>
                  <ErrorDisplay errors={errors} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <PaginationControls
        currentPage={currentPageMS}
        onPrev={() => onPageChange('MS', 'prev')}
        onNext={() => onPageChange('MS', 'next')}
        dataLength={dataMS.length}
      />
    </div>
  );
};

export default ProductionOrders;
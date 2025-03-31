import { Table } from 'react-bootstrap';
import PaginationControls from '../components/PaginationControls';
import ErrorDisplay from '../components/ErrorDisplay';

interface BillOfMaterialsProps {
  dataLM: any[];
  dataMS: any[];
  currentPageLM: number;
  currentPageMS: number;
  onPageChange: (key: 'LM' | 'MS', direction: 'next' | 'prev') => void;
  totalItemsLM: number;
  totalItemsMS: number;
}

const BillOfMaterials = ({
  dataLM,
  dataMS,
  currentPageLM,
  currentPageMS,
  onPageChange,
  totalItemsLM,
  totalItemsMS
}: BillOfMaterialsProps) => {
  const validateItem = (item: any) => {
    const errors: string[] = [];
    
    if (!item["Item Code"] || item["Item Code"] === "ITM999") errors.push("Invalid Item Code");
    if (item["Quantity"] === 0) errors.push("Quantity is zero");
    if (item["Quantity"] < 0) errors.push("Quantity is negative");
    if (!item["Description"]) errors.push("Description is missing");
    if (!item["UoM Name"]) errors.push("UoM Name is missing");
    if (!item["Warehouse"]) errors.push("Warehouse is missing");

    return errors;
  };

  return (
    <div>
      <h3 className="mb-4">Bill of Materials - LM</h3>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Item Code</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>UoM Name</th>
            <th>Warehouse</th>
            <th>Issue Method</th>
            <th>Product Code</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dataLM.map((item, index) => {
            const errors = validateItem(item);
            return (
              <tr key={`lm-${index}`} className={errors.length ? 'error-row' : ''}>
                <td>{item["Type"]}</td>
                <td>{item["Item Code"]}</td>
                <td>{item["Description"]}</td>
                <td>{item["Quantity"]}</td>
                <td>{item["UoM Name"]}</td>
                <td>{item["Warehouse"]}</td>
                <td>{item["Issue Method"]}</td>
                <td>{item["Product Code"]}</td>
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
        totalItems={totalItemsLM}
      />

      <h3 className="mb-4 mt-5">Bill of Materials - MS</h3>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Item Code</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>UoM Name</th>
            <th>Warehouse</th>
            <th>Issue Method</th>
            <th>Product Code</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {dataMS.map((item, index) => {
            const errors = validateItem(item);
            return (
              <tr key={`ms-${index}`} className={errors.length ? 'error-row' : ''}>
                <td>{item["Type"]}</td>
                <td>{item["Item Code"]}</td>
                <td>{item["Description"]}</td>
                <td>{item["Quantity"]}</td>
                <td>{item["UoM Name"]}</td>
                <td>{item["Warehouse"]}</td>
                <td>{item["Issue Method"]}</td>
                <td>{item["Product Code"]}</td>
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
        totalItems={totalItemsMS}
      />
    </div>
  );
};

export default BillOfMaterials;
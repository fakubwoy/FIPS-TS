import { Modal, Table, Button } from 'react-bootstrap';
import { ResourceAnalysisItem } from '../types/types';
import './modal.css';

interface ResourceDetailsModalProps {
  item: ResourceAnalysisItem | null;
  onHide: () => void;
}

interface ComponentItem {
  itemCode: string;
  description: string;
  requiredQty: number;
  availableStock: number;
  pendingPO: number;
  jobWorkStock: number;
  difference: number;
}

const ResourceDetailsModal = ({ item, onHide }: ResourceDetailsModalProps) => {
  if (!item) return null;

  return (
    <Modal show={true} onHide={onHide} size="xl" className="resource-details-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">
          Components for {item.productionNumber} - {item.productCode}
          <div className={`status-badge ${item.status.toLowerCase()}`}>
            {item.status}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom">
        <div className="summary-section">
          <div className="summary-item">
            <span className="summary-label">Total Required:</span>
            <span className="summary-value">{item.requiredQuantity.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Available:</span>
            <span className="summary-value">{item.totalAvailable.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Difference:</span>
            <span className={`summary-value ${item.difference < 0 ? 'negative' : 'positive'}`}>
              {Math.abs(item.difference).toFixed(2)} ({item.difference < 0 ? 'Shortage' : 'Excess'})
            </span>
          </div>
        </div>

        <div className="table-container">
          <Table striped bordered hover className="components-table">
            <thead className="table-header">
              <tr>
                <th className="item-code">Item Code</th>
                <th className="description">Description</th>
                <th className="numeric">Required</th>
                <th className="numeric">Available Stock</th>
                <th className="numeric">Pending PO</th>
                <th className="numeric">Job Work</th>
                <th className="numeric">Difference</th>
              </tr>
            </thead>
            <tbody>
              {item.components.map((comp: ComponentItem, idx: number) => (
                <tr key={`comp-${idx}`} className={comp.difference < 0 ? 'error-row' : ''}>
                  <td className="item-code">{comp.itemCode}</td>
                  <td className="description">{comp.description}</td>
                  <td className="numeric">{comp.requiredQty.toFixed(2)}</td>
                  <td className="numeric">{comp.availableStock.toFixed(2)}</td>
                  <td className="numeric">{comp.pendingPO.toFixed(2)}</td>
                  <td className="numeric">{comp.jobWorkStock.toFixed(2)}</td>
                  <td className={`numeric ${comp.difference < 0 ? 'negative' : 'positive'}`}>
                    {comp.difference.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        <Button variant="secondary" onClick={onHide} className="close-btn">
          Close
        </Button>
        <Button variant="primary" onClick={onHide} className="export-btn">
          Export to Excel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResourceDetailsModal;
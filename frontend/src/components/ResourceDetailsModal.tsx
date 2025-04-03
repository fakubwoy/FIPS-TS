import { Modal, Table, Button } from 'react-bootstrap';
import { ResourceAnalysisItem } from '../types/types';

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
    <Modal show={true} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Components for {item.productionNumber} - {item.productCode}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Description</th>
              <th>Required</th>
              <th>Available Stock</th>
              <th>Pending PO</th>
              <th>Job Work</th>
              <th>Difference</th>
            </tr>
          </thead>
          <tbody>
            {item.components.map((comp: ComponentItem, idx: number) => (
              <tr key={`comp-${idx}`} className={comp.difference < 0 ? 'error-row' : ''}>
                <td>{comp.itemCode}</td>
                <td>{comp.description}</td>
                <td>{comp.requiredQty.toFixed(2)}</td>
                <td>{comp.availableStock.toFixed(2)}</td>
                <td>{comp.pendingPO.toFixed(2)}</td>
                <td>{comp.jobWorkStock.toFixed(2)}</td>
                <td>{comp.difference.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResourceDetailsModal;
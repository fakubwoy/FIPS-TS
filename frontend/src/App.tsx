import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import { Container, Nav, Navbar, Modal, Button } from "react-bootstrap";
import ProductionOrders from "./pages/ProductionOrders";
import BillOfMaterials from "./pages/BillOfMaterials";
import QCStock from "./pages/QCStock";
import Inventory from "./pages/Inventory";
import FileUploader from "./components/FileUploader";
import { ProcessedExcelData, ResourceAnalysisItem } from "./types/types";
import { processExcelFile } from "./services/api";
import { generateInventoryAnalysisReport, downloadExcelReport } from './services/reportService';
import "./styles/main.css";
import "./styles/table.css";
import "./styles/navbar.css";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [data, setData] = useState<ProcessedExcelData | null>(null);
  const [currentPage, setCurrentPage] = useState({
    LM: 1,
    MS: 1,
    QCStock: 1,
    Inventory: 1,
    Combined: 1,
    AnalysisLM: 1,
    AnalysisMS: 1
  });
  const [selectedAnalysis, setSelectedAnalysis] = useState<ResourceAnalysisItem | null>(null);
  const location = useLocation();
  const handleDownloadReport = () => {
    if (!data) return;
    
    const reportData = generateInventoryAnalysisReport(data);
    downloadExcelReport(reportData, "Inventory_Analysis_Report");
  };
  const handleFileUpload = async (file: File) => {
    try {
      const processedData = await processExcelFile(file);
      const completeData: ProcessedExcelData = {
        productionOrdersLM: processedData.productionOrdersLM || [],
        productionOrdersMS: processedData.productionOrdersMS || [],
        bomLM: processedData.bomLM || [],
        bomMS: processedData.bomMS || [],
        qcStock: processedData.qcStock || [],
        inventoryStock: processedData.inventoryStock || [],
        combinedStock: processedData.combinedStock || [],
        jobWorkStock: processedData.jobWorkStock || [],
        pendingPO: processedData.pendingPO || [],
        resourceAnalysis: processedData.resourceAnalysis || []
      };
      setData(completeData);
      setCurrentPage({
        LM: 1,
        MS: 1,
        QCStock: 1,
        Inventory: 1,
        Combined: 1,
        AnalysisLM: 1,
        AnalysisMS: 1
      });
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file. Please check the console for details.");
    }
  };

  const handlePageChange = (key: keyof typeof currentPage, direction: 'next' | 'prev') => {
    setCurrentPage(prev => ({
      ...prev,
      [key]: direction === 'next' ? prev[key] + 1 : prev[key] - 1
    }));
  };

  const showAnalysisDetails = (item: ResourceAnalysisItem) => {
    setSelectedAnalysis(item);
  };

  const closeAnalysisDetails = () => {
    setSelectedAnalysis(null);
  };

  const filterAnalysisByType = (type: 'LM' | 'MS') => {
    if (!data?.resourceAnalysis) return [];
    
    let filtered = data.resourceAnalysis.filter(item => 
      item.productCode.includes(type)
    );
    
    if (filtered.length === 0) {
      const prodNumbers = type === 'LM' 
        ? data.productionOrdersLM.map(po => po["Prod No"])
        : data.productionOrdersMS.map(po => po["Prod No"]);
      
      filtered = data.resourceAnalysis.filter(item =>
        prodNumbers.includes(item.productionNumber)
      );
    }
    
    return filtered;
  };

  const analysisLM = filterAnalysisByType('LM');
  const analysisMS = filterAnalysisByType('MS');

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/">Factory Production System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/bill-of-materials">Bill of Materials</Nav.Link>
              <Nav.Link as={Link} to="/production-orders">Production Orders</Nav.Link>
              <Nav.Link as={Link} to="/qc-stock">QC Stock</Nav.Link>
              <Nav.Link as={Link} to="/inventory">Inventory</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="main-container">
        <FileUploader onFileUpload={handleFileUpload} />
        
        {location.pathname === "/" && data && (
          <>
            {analysisLM.length > 0 && (
              
              <div className="resource-analysis mt-4">
                <Button 
                  variant="success" 
                  onClick={handleDownloadReport}
                  disabled={!data}
                  className="ms-2"
                >
                  Download Inventory Analysis Report
                </Button>
                <h3>LM Production Resource Analysis</h3>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Production #</th>
                        <th>Product Code</th>
                        <th>Required Qty</th>
                        <th>Available Qty</th>
                        <th>Difference</th>
                        <th>Status</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisLM
                        .slice((currentPage.AnalysisLM - 1) * 10, currentPage.AnalysisLM * 10)
                        .map((item, idx) => (
                        <tr key={`analysis-lm-${idx}`} className={item.status === 'Shortage' ? 'error-row' : ''}>
                          <td>{item.productionNumber}</td>
                          <td>{item.productCode}</td>
                          <td>{item.requiredQuantity.toFixed(2)}</td>
                          <td>{item.totalAvailable.toFixed(2)}</td>
                          <td>{Math.abs(item.difference).toFixed(2)}</td>
                          <td>
                            <span className={item.status === 'Shortage' ? 'error-text' : 'success-text'}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <Button 
                              variant="info"
                              size="sm"
                              onClick={() => showAnalysisDetails(item)}
                            >
                              View Components
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  currentPage={currentPage.AnalysisLM}
                  onPrev={() => handlePageChange('AnalysisLM', 'prev')}
                  onNext={() => handlePageChange('AnalysisLM', 'next')}
                  totalItems={analysisLM.length}
                />
              </div>
            )}

            {analysisMS.length > 0 && (
              <div className="resource-analysis mt-5">
                <h3>MS Production Resource Analysis</h3>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Production #</th>
                        <th>Product Code</th>
                        <th>Required Qty</th>
                        <th>Available Qty</th>
                        <th>Difference</th>
                        <th>Status</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisMS
                        .slice((currentPage.AnalysisMS - 1) * 10, currentPage.AnalysisMS * 10)
                        .map((item, idx) => (
                        <tr key={`analysis-ms-${idx}`} className={item.status === 'Shortage' ? 'error-row' : ''}>
                          <td>{item.productionNumber}</td>
                          <td>{item.productCode}</td>
                          <td>{item.requiredQuantity.toFixed(2)}</td>
                          <td>{item.totalAvailable.toFixed(2)}</td>
                          <td>{Math.abs(item.difference).toFixed(2)}</td>
                          <td>
                            <span className={item.status === 'Shortage' ? 'error-text' : 'success-text'}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <Button 
                              variant="info"
                              size="sm"
                              onClick={() => showAnalysisDetails(item)}
                            >
                              View Components
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  currentPage={currentPage.AnalysisMS}
                  onPrev={() => handlePageChange('AnalysisMS', 'prev')}
                  onNext={() => handlePageChange('AnalysisMS', 'next')}
                  totalItems={analysisMS.length}
                />
              </div>
            )}

            {data.combinedStock && data.combinedStock.length > 0 && (
              <div className="combined-stock mt-5">
                <h2>Combined Stock Overview</h2>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Item Code</th>
                        <th>Description</th>
                        <th>QC Stock</th>
                        <th>Inventory Stock</th>
                        <th>Total Stock</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.combinedStock
                        .slice((currentPage.Combined - 1) * 10, currentPage.Combined * 10)
                        .map((item, index) => (
                        <tr key={`combined-${index}`} className={item.errors?.length ? 'error-row' : ''}>
                          <td>{item.itemCode}</td>
                          <td>{item.description}</td>
                          <td>{item.qcStockOn}</td>
                          <td>{item.inventoryStockOn}</td>
                          <td>{item.totalStockOn}</td>
                          <td>
                            {item.errors?.length > 0 ? (
                              <span className="error-text">{item.errors.join(', ')}</span>
                            ) : 'OK'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  currentPage={currentPage.Combined}
                  onPrev={() => handlePageChange('Combined', 'prev')}
                  onNext={() => handlePageChange('Combined', 'next')}
                  totalItems={data.combinedStock.length}
                />
              </div>
            )}
          </>
        )}

        <Routes>
          <Route path="/" element={<div />} />
          <Route path="/production-orders" element={
            <ProductionOrders 
              dataLM={data?.productionOrdersLM?.slice((currentPage.LM - 1) * 10, currentPage.LM * 10) || []} 
              dataMS={data?.productionOrdersMS?.slice((currentPage.MS - 1) * 10, currentPage.MS * 10) || []} 
              currentPageLM={currentPage.LM}
              currentPageMS={currentPage.MS}
              onPageChange={handlePageChange}
              totalItemsLM={data?.productionOrdersLM?.length || 0}
              totalItemsMS={data?.productionOrdersMS?.length || 0}
            />} 
          />
          <Route path="/bill-of-materials" element={
            <BillOfMaterials
              dataLM={data?.bomLM?.slice((currentPage.LM - 1) * 10, currentPage.LM * 10) || []}
              dataMS={data?.bomMS?.slice((currentPage.MS - 1) * 10, currentPage.MS * 10) || []}
              currentPageLM={currentPage.LM}
              currentPageMS={currentPage.MS}
              onPageChange={handlePageChange}
              totalItemsLM={data?.bomLM?.length || 0}
              totalItemsMS={data?.bomMS?.length || 0}
            />}
          />
          <Route path="/qc-stock" element={
            <QCStock
              data={data?.qcStock?.slice((currentPage.QCStock - 1) * 10, currentPage.QCStock * 10) || []}
              currentPage={currentPage.QCStock}
              onPageChange={(dir) => handlePageChange('QCStock', dir)}
              totalItems={data?.qcStock?.length || 0}
            />}
          />
          <Route path="/inventory" element={
            <Inventory
              data={data?.inventoryStock?.slice((currentPage.Inventory - 1) * 10, currentPage.Inventory * 10) || []}
              currentPage={currentPage.Inventory}
              onPageChange={(dir) => handlePageChange('Inventory', dir)}
              totalItems={data?.inventoryStock?.length || 0}
            />}
          />
        </Routes>
      </Container>

      <Modal show={!!selectedAnalysis} onHide={closeAnalysisDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Components for {selectedAnalysis?.productionNumber} - {selectedAnalysis?.productCode}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table-responsive">
            <table className="custom-table">
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
                {selectedAnalysis?.components.map((comp, idx) => (
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
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAnalysisDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const PaginationControls = ({
  currentPage,
  onPrev,
  onNext,
  totalItems,
  rowsPerPage = 10
}: {
  currentPage: number;
  onPrev: () => void;
  onNext: () => void;
  totalItems: number;
  rowsPerPage?: number;
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  return (
    <div className="d-flex justify-content-between align-items-center my-3">
      <span>
        Showing {startItem}-{endItem} of {totalItems} items
      </span>
      <div className="btn-group">
        <button
          className="btn btn-outline-primary"
          onClick={onPrev}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline-primary"
          onClick={onNext}
          disabled={currentPage >= totalPages || totalItems <= rowsPerPage}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AppWrapper;
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import ProductionOrders from "./pages/ProductionOrders";
import BillOfMaterials from "./pages/BillOfMaterials";
import QCStock from "./pages/QCStock";
import Inventory from "./pages/Inventory";
import FileUploader from "./components/FileUploader";
import { ProcessedExcelData } from "./types/types";
import { processExcelFile } from "./services/api";
import "./styles/main.css";
import "./styles/table.css";
import "./styles/navbar.css";

function App() {
  const [data, setData] = useState<ProcessedExcelData | null>(null);
  const [currentPage, setCurrentPage] = useState({
    LM: 1,
    MS: 1,
    QCStock: 1,
    Inventory: 1,
    Combined: 1
  });
  const [rowsPerPage] = useState(10);

  const handleFileUpload = async (file: File) => {
    try {
      const processedData = await processExcelFile(file);
      setData(processedData);
      setCurrentPage({
        LM: 1,
        MS: 1,
        QCStock: 1,
        Inventory: 1,
        Combined: 1
      });
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file. Please check the console for details.");
    }
  };

  const getPaginatedData = <T,>(data: T[], page: number): T[] => {
    const startIndex = (page - 1) * rowsPerPage;
    return data.slice(startIndex, startIndex + rowsPerPage);
  };

  const handlePageChange = (key: keyof typeof currentPage, direction: 'next' | 'prev') => {
    setCurrentPage(prev => ({
      ...prev,
      [key]: direction === 'next' ? prev[key] + 1 : prev[key] - 1
    }));
  };

  return (
    <Router>
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
        
        <Routes>
          <Route path="/" element={<Home combinedStock={data?.combinedStock || []} />} />
          <Route path="/production-orders" element={
            <ProductionOrders 
              dataLM={getPaginatedData(data?.productionOrdersLM || [], currentPage.LM)} 
              dataMS={getPaginatedData(data?.productionOrdersMS || [], currentPage.MS)} 
              currentPageLM={currentPage.LM}
              currentPageMS={currentPage.MS}
              onPageChange={handlePageChange}
              totalItemsLM={data?.productionOrdersLM.length || 0}
              totalItemsMS={data?.productionOrdersMS.length || 0}
            />} 
          />
          <Route path="/bill-of-materials" element={
            <BillOfMaterials
              dataLM={getPaginatedData(data?.bomLM || [], currentPage.LM)}
              dataMS={getPaginatedData(data?.bomMS || [], currentPage.MS)}
              currentPageLM={currentPage.LM}
              currentPageMS={currentPage.MS}
              onPageChange={handlePageChange}
              totalItemsLM={data?.bomLM.length || 0}
              totalItemsMS={data?.bomMS.length || 0}
            />}
          />
          <Route path="/qc-stock" element={
            <QCStock
              data={getPaginatedData(data?.qcStock || [], currentPage.QCStock)}
              currentPage={currentPage.QCStock}
              onPageChange={(dir) => handlePageChange('QCStock', dir)}
              totalItems={data?.qcStock.length || 0}
            />}
          />
          <Route path="/inventory" element={
            <Inventory
              data={getPaginatedData(data?.inventoryStock || [], currentPage.Inventory)}
              currentPage={currentPage.Inventory}
              onPageChange={(dir) => handlePageChange('Inventory', dir)}
              totalItems={data?.inventoryStock.length || 0}
            />}
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

const Home = ({ combinedStock }: { combinedStock: any[] }) => (
  <div className="home-container">
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
          {combinedStock.map((item, index) => (
            <tr key={index} className={item.errors?.length ? 'error-row' : ''}>
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
  </div>
);
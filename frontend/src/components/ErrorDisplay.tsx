interface ErrorDisplayProps {
    errors: string[];
  }
  
  const ErrorDisplay = ({ errors }: ErrorDisplayProps) => {
    if (errors.length === 0) {
      return <span className="success-text">OK</span>;
    }
  
    return (
      <div>
        {errors.map((error, index) => (
          <div key={index} className="error-text">
            {error}
          </div>
        ))}
      </div>
    );
  };
  
  export default ErrorDisplay;
import { Button, Col, Row } from "react-bootstrap";

type ErrorPageProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
};

export function ErrorPage({
  title = "Something went wrong",
  message,
  onRetry,
  onBack,
}: ErrorPageProps) {
  return (
    <Row className="justify-content-center h-100">
      <Col xs={12} md={8} lg={6} className="align-self-center text-center">
        <h2 className="mb-2">{title}</h2>
        <p className="text-muted mb-4">{message}</p>
        <div className="d-flex justify-content-center gap-2">
          {onBack && (
            <Button variant="outline-secondary" onClick={onBack}>
              Go back
            </Button>
          )}
          {onRetry && <Button onClick={onRetry}>Try again</Button>}
        </div>
      </Col>
    </Row>
  );
}

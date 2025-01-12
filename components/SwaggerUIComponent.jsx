import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerUIComponent() {
  return <SwaggerUI url="https://api.uverify.io/v1/api-docs" />;
}

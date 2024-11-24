export const environment = {
  production: false,
  proxyBase: 'http://localhost:5030/api/v1',
  baseURL: 'http://localhost:5030/api/v1',
  tahakomUrl: 'https://fotrahbe.ripc.gov.sa/api/v1',
  redirectURL: location.origin + '/public/payment-success',
  responseURL: location.origin + '/public/payment-success',
  errorURL: location.origin + '/public/payment-failure',
  action: 'https://securepayments.alrajhibank.com.sa/pg/servlet/PaymentInitHTTPServlet',
  filePath : '\\\\ripctest.loc\\ripctestdfs\\Objections\\',
  fileUrl : window.origin + "/test/"
}

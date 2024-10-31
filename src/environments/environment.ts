export const environment = {
  production: true,
  proxyBase: '/api',
  baseURL: 'https://fotrahbe.ripc.gov.sa/api/v1',
  tahakomUrl: 'https://fotrahbe.ripc.gov.sa/api/v1',
  redirectURL: location.origin + '/public/payment-success',
  responseURL: location.origin + '/public/payment-success',
  errorURL: location.origin + '/public/payment-failure',
  action: 'https://securepayments.alrajhibank.com.sa/pg/servlet/PaymentInitHTTPServlet',
  filePath : '\\\\ripc.loc\\ripcdfs\\Objections\\',
  fileUrl : window.origin + "/objections/"

};
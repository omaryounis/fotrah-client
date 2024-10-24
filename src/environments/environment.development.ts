export const environment = {
  production: false,
  proxyBase: '/api',
  baseURL: 'https://fotrahbet.ripc.gov.sa/api/v1',
  tahakomUrl: 'https://fotrahbe.ripc.gov.sa/api/v1',
  redirectURL: location.origin + '/public/payment-success',
  responseURL: location.origin + '/public/payment-success',
  errorURL: location.origin + '/public/payment-failure',
  action: 'https://securepayments.alrajhibank.com.sa/pg/servlet/PaymentInitHTTPServlet',
  filePath : '\\\\ripctest.loc\\ripctestdfs\\Objections\\'


}

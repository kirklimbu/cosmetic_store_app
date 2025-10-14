class AppConfig {
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://94.136.187.127:11051/inventory/api',
  );

  static const String environment = String.fromEnvironment(
    'ENV',
    defaultValue: 'development',
  );
}

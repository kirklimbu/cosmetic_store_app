import 'package:dio/dio.dart';
import 'package:flutter_application__farista_clinic/config/environment.dart';
import 'package:shared_preferences/shared_preferences.dart';

class DioInterceptor {
  static Dio createDio() {
    final dio = Dio(
      BaseOptions(
        baseUrl: Environment.apiBaseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        sendTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'test',
        },
      ),
    );

    // Add interceptors
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          // Add auth token to every request
          final token = _getAuthToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }

          // Log request
          print('🌐 ${options.method.toUpperCase()}: ${options.uri}');
          if (options.data != null) {
            print('📦 Request Body: ${options.data}');
          }

          return handler.next(options);
        },
        onResponse: (response, handler) {
          print(
            '📡 Response: ${response.statusCode} ${response.requestOptions.uri}',
          );
          return handler.next(response);
        },
        onError: (DioException error, handler) {
          print('❌ Error: ${error.type} - ${error.message}');
          if (error.response != null) {
            print('❌ Status: ${error.response?.statusCode}');
            print('❌ Body: ${error.response?.data}');
          }

          // Handle specific error cases
          if (error.response?.statusCode == 401) {
            // Token expired - redirect to login
            _handleUnauthorized();
          }

          return handler.next(error);
        },
      ),
    );

    // Add logging interceptor (optional)
    // dio.interceptors.add(LogInterceptor(
    //   request: true,
    //   requestHeader: true,
    //   requestBody: true,
    //   responseHeader: true,
    //   responseBody: true,
    // ));

    return dio;
  }

  static void _handleUnauthorized() {
    // Handle unauthorized access
    // You might want to clear storage and navigate to login
    print('🚨 Unauthorized access - redirecting to login');
  }

  static Future<String?> _getAuthToken() async {
    // Get from shared preferences or provider
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('auth_token');
  }
}

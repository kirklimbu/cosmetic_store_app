import 'package:dio/dio.dart';
import 'package:flutter_application__farista_clinic/models/home_model.dart';
import 'dio_interceptor.dart';

class DioHomeService {
  final Dio _dio;

  DioHomeService() : _dio = DioInterceptor.createDio();

  // Equivalent to getHomeContents(id: string): Observable<IHome1DtoWrapper>
  Future<Home1DtoWrapper> getHomeContents(String deviceId) async {
    try {
      final response = await _dio.get(
        'home',
        queryParameters: {'deviceId': deviceId},
      );

      return Home1DtoWrapper.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to load home contents: ${e.message}');
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Equivalent to getOrganization(id: string): Observable<IOrganization>
  // Future<Organization> getOrganization(String deviceId) async {
  //   try {
  //     final response = await _dio.get(
  //       'home',
  //       queryParameters: {'deviceId': deviceId},
  //     );

  //     final organizationData = response.data['organization'];
  //     if (organizationData != null) {
  //       return Organization.fromJson(organizationData);
  //     } else {
  //       throw Exception('Organization data not found in response');
  //     }
  //   } on DioException catch (e) {
  //     throw Exception('Failed to load organization: ${e.message}');
  //   } catch (e) {
  //     throw Exception('Network error: $e');
  //   }
  // }

  // Equivalent to getCategories(query?: any): Observable<any>
  // Future<List<Category>> getCategories({String? parentId}) async {
  //   try {
  //     final response = await _dio.get(
  //       'category/list',
  //       queryParameters: {'parentId': parentId ?? '0'},
  //     );

  //     final List<dynamic> responseData = response.data;
  //     return responseData.map((item) => Category.fromJson(item)).toList();
  //   } on DioException catch (e) {
  //     throw Exception('Failed to load categories: ${e.message}');
  //   } catch (e) {
  //     throw Exception('Network error: $e');
  //   }
  // }

  void dispose() {
    _dio.close();
  }
}

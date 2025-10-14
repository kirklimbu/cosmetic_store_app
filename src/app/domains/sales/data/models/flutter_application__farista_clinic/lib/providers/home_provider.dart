import 'package:flutter/foundation.dart';
import 'package:flutter_application__farista_clinic/models/home_model.dart';
import 'package:flutter_application__farista_clinic/services/home_service.dart';

class HomeProvider with ChangeNotifier {
  List<BannerDto> _BannerDtos = [];
  List<Category> _categories = [];
  List<Company> _brands = [];
  List<Product> _Products = [];
  List<ServiceDto> _services = [];
  List<Company> _companies = [];
  Organization? _organization;
  bool _isLoading = false;
  String _error = '';

  List<BannerDto> get BannerDtos => _BannerDtos;
  List<Category> get categories => _categories;
  List<Company> get brands => _brands;
  List<Product> get Products => _Products;
  List<ServiceDto> get services => _services;
  List<Company> get companies => _companies;
  Organization? get organization => _organization;
  bool get isLoading => _isLoading;
  String get error => _error;

  final DioHomeService _homeService;

  HomeProvider({DioHomeService? homeService})
    : _homeService = homeService ?? DioHomeService();

  // Load all home page data using real API calls
  Future<void> loadHomeData() async {
    _isLoading = true;
    _error = '';
    notifyListeners();

    try {
      // Get device ID
      final deviceId = await _getDeviceId();

      // Load home contents
      final homeContents = await _homeService.getHomeContents(deviceId);

      // Load categories
      // final categories = await _homeService.getCategories();

      // Transform API data to app models
      _transformApiData(homeContents, categories);

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      _error = 'Failed to load home data: $e';
      notifyListeners();
    }
  }

  // Load categories with parent ID (for nested categories)
  // Future<void> loadCategories({String? parentId}) async {
  //   try {
  //     final categories = await _homeService.getCategories(parentId: parentId);
  //     _categories = _transformCategories(categories);
  //     notifyListeners();
  //   } catch (e) {
  //     _error = 'Failed to load categories: $e';
  //     notifyListeners();
  //   }
  // }

  // Get organization info
  Future<Organization?> getOrganizationInfo() async {
    // try {
    //   final deviceId = await _getDeviceId();
    //   _organization = await _homeService.getOrganization(deviceId);
    //   notifyListeners();
    //   return _organization;
    // } catch (e) {
    //   _error = 'Failed to load organization: $e';
    //   notifyListeners();
    //   return null;
    // }
  }

  // Refresh all data
  Future<void> refresh() async {
    _homeService.dispose();
    await loadHomeData();
  }

  // Private methods
  Future<String> _getDeviceId() async {
    // You can implement device ID generation here
    // For now, using a simple timestamp-based ID
    return DateTime.now().millisecondsSinceEpoch.toString();
  }

  void _transformApiData(
    Home1DtoWrapper homeContents,
    List<Category> apiCategories,
  ) {
    // Set organization
    _organization = homeContents.organization;

    // Transform banners to carousel items
    _BannerDtos = _transformBannersToCarousel(homeContents.bannerList);

    // Transform services
    _services = homeContents.serviceList;

    // Transform companies to brands
    _brands = _transformCompaniesToBrands(homeContents.companyList);

    // Transform categories
    // _categories = _transformCategories(apiCategories);

    // Transform product sections
    // _Products = _transformProducts(homeContents);
  }

  List<BannerDto> _transformBannersToCarousel(List<BannerDto> banners) {
    return banners.map((banner) {
      return BannerDto(
        id: banner.id,
        imageUrl: banner.imageUrl,
        title: banner.title,
        subtitle: banner.subtitle,
        actionUrl: banner.actionUrl,
      );
    }).toList();
  }

  List<Company> _transformCompaniesToBrands(List<Company> companies) {
    return companies.map((company) {
      return Company(
        id: company.id,
        name: company.name,
        imageUrl: company.imageUrl,
        description: company.description,
      );
    }).toList();
  }

  // List<Category> _transformCategories(List<Category> apiCategories) {
  //   return apiCategories.map((apiCategory) {
  //     return Category(
  //       id: apiCategory.id,
  //       name: apiCategory.name,
  //       imageUrl: apiCategory.imageUrl,
  //       productCount: apiCategory.productCount,
  //       description: apiCategory.description,
  //     );
  //   }).toList();
  // }

  // List<Product> _transformProducts(Home1DtoWrapper homeContents) {
  // final sections = <Product>[];

  // Latest Products Section from productList
  // if (homeContents.productList.isNotEmpty) {
  //   sections.add(
  //     Product(
  //       id: 'latest',
  //       title: 'Latest Products',
  //       subtitle: 'Newly added to our store',
  //       products: _transformApiProducts(homeContents.productList),
  //     ),
  //   );
  // }

  // You can add more sections based on your API response
  // For example, if you have featured products in the API:
  // if (homeContents.featuredProducts != null && homeContents.featuredProducts!.isNotEmpty) {
  //   sections.add(Product(
  //     id: 'featured',
  //     title: 'Featured Products',
  //     subtitle: 'Handpicked for you',
  //     products: _transformApiProducts(homeContents.featuredProducts!),
  //   ));
  // }

  // return sections;
  // }

  List<Product> _transformApiProducts(List<dynamic> apiProducts) {
    return apiProducts.map((apiProduct) {
      // Since productList is any[], we need to handle dynamic data
      if (apiProduct is Map<String, dynamic>) {
        return Product(
          id: apiProduct['id']?.toString() ?? '',
          name: apiProduct['name'] ?? 'Unknown Product',
          description: apiProduct['description'] ?? '',
          price: (apiProduct['price'] ?? 0.0).toDouble(),
          originalPrice: apiProduct['originalPrice'] != null
              ? (apiProduct['originalPrice']).toDouble()
              : null,
          imageUrl: apiProduct['imageUrl'] ?? apiProduct['image'] ?? '',
          category: apiProduct['category'] ?? 'General',
          brand: apiProduct['brand'] ?? 'Unknown Brand',
          stock: apiProduct['stock'] ?? apiProduct['quantity'] ?? 0,
          rating: (apiProduct['rating'] ?? 0.0).toDouble(),
          reviewCount: apiProduct['reviewCount'] ?? 0,
          isFeatured: apiProduct['isFeatured'] ?? false,
        );
      } else {
        // Fallback for unexpected data types - but this should not happen with real API
        throw Exception(
          'Unexpected product data type: ${apiProduct.runtimeType}',
        );
      }
    }).toList();
  }

  void dispose() {
    _homeService.dispose();
  }
}

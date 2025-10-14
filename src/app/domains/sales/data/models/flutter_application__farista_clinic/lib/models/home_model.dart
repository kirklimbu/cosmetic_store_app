class Home1DtoWrapper {
  final List<BannerDto> bannerList;
  final List<ServiceDto> serviceList;
  final List<Company> companyList;
  final List<dynamic> productList; // Using dynamic since it's any[] in Angular
  final Organization organization;

  Home1DtoWrapper({
    required this.bannerList,
    required this.serviceList,
    required this.companyList,
    required this.productList,
    required this.organization,
  });

  factory Home1DtoWrapper.fromJson(Map<String, dynamic> json) {
    return Home1DtoWrapper(
      bannerList: json['bannerList'] != null
          ? List<BannerDto>.from(
              json['bannerList'].map((x) => BannerDto.fromJson(x)),
            )
          : <BannerDto>[],
      serviceList: json['serviceList'] != null
          ? List<ServiceDto>.from(
              json['serviceList'].map((x) => ServiceDto.fromJson(x)),
            )
          : <ServiceDto>[],
      companyList: json['companyList'] != null
          ? List<Company>.from(
              json['companyList'].map((x) => Company.fromJson(x)),
            )
          : <Company>[],
      productList: json['productList'] != null
          ? List<dynamic>.from(json['productList'])
          : <dynamic>[],
      organization: Organization.fromJson(json['organization'] ?? {}),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'bannerList': bannerList.map((x) => x.toJson()).toList(),
      'serviceList': serviceList.map((x) => x.toJson()).toList(),
      'companyList': companyList.map((x) => x.toJson()).toList(),
      'productList': productList,
      'organization': organization.toJson(),
    };
  }
}

class BannerDto {
  final String id;
  final String title;
  final String? subtitle;
  final String imageUrl;
  final String? actionUrl;
  // final int displayOrder;
  // final bool isActive;
  final DateTime? startDate;
  final DateTime? endDate;

  BannerDto({
    required this.id,
    required this.title,
    this.subtitle,
    required this.imageUrl,
    this.actionUrl,
    // required this.displayOrder,
    // required this.isActive,
    this.startDate,
    this.endDate,
  });

  factory BannerDto.fromJson(Map<String, dynamic> json) {
    return BannerDto(
      id: json['id']?.toString() ?? '',
      title: json['title'] ?? '',
      subtitle: json['subtitle'],
      imageUrl: json['imageUrl'] ?? json['image'] ?? '',
      actionUrl: json['actionUrl'],

      startDate: json['startDate'] != null
          ? DateTime.parse(json['startDate'])
          : null,
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'subtitle': subtitle,
      'imageUrl': imageUrl,
      'actionUrl': actionUrl,

      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
    };
  }
}

class ServiceDto {
  final String id;
  final String name;
  final String? description;
  final String iconUrl;
  final String? serviceUrl;
  final int displayOrder;
  final bool isActive;

  ServiceDto({
    required this.id,
    required this.name,
    this.description,
    required this.iconUrl,
    this.serviceUrl,
    required this.displayOrder,
    required this.isActive,
  });

  factory ServiceDto.fromJson(Map<String, dynamic> json) {
    return ServiceDto(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      iconUrl: json['iconUrl'] ?? json['icon'] ?? '',
      serviceUrl: json['serviceUrl'],
      displayOrder: json['displayOrder'] ?? 0,
      isActive: json['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'iconUrl': iconUrl,
      'serviceUrl': serviceUrl,
      'displayOrder': displayOrder,
      'isActive': isActive,
    };
  }
}

class Company {
  final String id;
  final String name;
  final String? description;
  final String imageUrl;
  // final bool isActive;

  Company({
    required this.id,
    required this.name,
    this.description,
    required this.imageUrl,
  });

  factory Company.fromJson(Map<String, dynamic> json) {
    return Company(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      imageUrl: json['imageUrl'] ?? json['logo'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'logoUrl': imageUrl,
    };
  }
}

class Organization {
  final String id;
  final String name;
  final String? description;
  final String logoUrl;
  final String? website;
  final String? contactEmail;
  final String? contactPhone;
  final String? address;
  final Map<String, dynamic>? socialMedia;
  final Map<String, dynamic>? businessHours;

  Organization({
    required this.id,
    required this.name,
    this.description,
    required this.logoUrl,
    this.website,
    this.contactEmail,
    this.contactPhone,
    this.address,
    this.socialMedia,
    this.businessHours,
  });

  factory Organization.fromJson(Map<String, dynamic> json) {
    return Organization(
      id: json['id']?.toString() ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      logoUrl: json['logoUrl'] ?? json['logo'] ?? '',
      website: json['website'],
      contactEmail: json['contactEmail'],
      contactPhone: json['contactPhone'],
      address: json['address'],
      socialMedia: json['socialMedia'] != null
          ? Map<String, dynamic>.from(json['socialMedia'])
          : null,
      businessHours: json['businessHours'] != null
          ? Map<String, dynamic>.from(json['businessHours'])
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'logoUrl': logoUrl,
      'website': website,
      'contactEmail': contactEmail,
      'contactPhone': contactPhone,
      'address': address,
      'socialMedia': socialMedia,
      'businessHours': businessHours,
    };
  }
}

// Product models
class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final double? originalPrice;
  final String imageUrl;
  final List<String> imageUrls;
  final String category;
  final String brand;
  final int stock;
  final double rating;
  final int reviewCount;
  final bool isFeatured;
  final Map<String, dynamic>? attributes;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    this.originalPrice,
    required this.imageUrl,
    this.imageUrls = const [],
    required this.category,
    required this.brand,
    required this.stock,
    this.rating = 0.0,
    this.reviewCount = 0,
    this.isFeatured = false,
    this.attributes,
  });

  bool get hasDiscount => originalPrice != null && originalPrice! > price;
  double get discountPercentage => hasDiscount
      ? ((originalPrice! - price) / originalPrice! * 100).roundToDouble()
      : 0.0;
}

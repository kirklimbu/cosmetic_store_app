import 'package:flutter/material.dart';
import 'package:flutter_application__farista_clinic/providers/home_provider.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'services/auth_service.dart';
import 'screens/login_page.dart';
import 'screens/home_screen.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (context) => AuthProvider(
            authService: AuthService(), // No need to pass client now
          ),
        ),
        ChangeNotifierProvider(create: (context) => HomeProvider()),
      ],
      child: MaterialApp(
        title: 'Shree Shyam Suppliers',
        theme: ThemeData(primarySwatch: Colors.blue, fontFamily: 'Inter'),
        home: const HomeScreen(),
        routes: {
          '/login': (context) => LoginScreen(),
          '/home': (context) => HomeScreen(),
        },
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

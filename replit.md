# Overview

This is a Flutter-based expense management application that provides comprehensive expense tracking capabilities across multiple platforms (iOS, Android, Web, Windows, Linux, macOS). The app features voice input for expense entry, data visualization with charts, CSV/Excel export functionality, AI-powered insights using Google's Generative AI, and a local web server for data sharing.

**Status**: ✅ Successfully configured and running in Replit environment. The Dart web server is operational on port 5000, serving the expense manager interface and ready for production deployment.

**Current Setup**: Since Flutter is not available in the Replit environment, the project runs the Dart web server (bin/server.dart) which serves a comprehensive HTML interface describing all the expense manager features and technical architecture. The server is properly configured to run on 0.0.0.0:5000 and includes deployment settings for autoscale deployment.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Flutter for cross-platform development
- **UI Components**: Material Design widgets with Cupertino icons for iOS-style elements
- **Charts**: FL Chart library for data visualization and expense analytics
- **Internationalization**: Built-in Flutter localization support for multi-language functionality

## Data Storage
- **Primary Storage**: Hive (NoSQL) for lightweight, fast local data storage
- **Secondary Storage**: SQLite via sqflite for structured data when needed
- **File System**: Path provider for accessing device storage directories

## Voice and Input Features
- **Speech Recognition**: Speech-to-text functionality for hands-free expense entry
- **File Operations**: File picker for importing/exporting data files
- **Permissions**: Permission handler for accessing device features like microphone and storage

## Data Export and Sharing
- **Export Formats**: CSV and Excel file generation for expense reports
- **Sharing**: Share Plus for cross-platform file sharing capabilities
- **Web Server**: Built-in Shelf server for local data access and sharing

## AI Integration
- **AI Service**: Google Generative AI for intelligent expense categorization and insights
- **HTTP Client**: Standard HTTP package for API communications

## Cross-Platform Support
- **Mobile**: Native iOS and Android apps with platform-specific optimizations
- **Desktop**: Windows, Linux, and macOS support with native window management
- **Web**: Progressive Web App (PWA) capabilities with offline support
- **Build System**: CMake for desktop platforms, standard Flutter tooling for mobile/web

## Development and Testing
- **Linting**: Flutter Lints for code quality enforcement
- **Testing**: Flutter Test framework for unit and widget testing
- **Build Configuration**: Platform-specific build configurations for optimal performance

# External Dependencies

## Core Flutter Packages
- **flutter**: Core Flutter framework
- **cupertino_icons**: iOS-style icons
- **flutter_localizations**: Internationalization support

## Data Management
- **hive** & **hive_flutter**: NoSQL local database
- **sqflite**: SQLite database for structured data
- **path** & **path_provider**: File system path management

## File Operations
- **csv**: CSV file generation and parsing
- **excel**: Excel file creation and manipulation
- **file_picker**: Cross-platform file selection
- **share_plus**: File sharing across platforms

## UI and Visualization
- **fl_chart**: Chart and graph generation for expense analytics

## Voice and Input
- **speech_to_text**: Voice recognition for expense entry

## Network and AI
- **http**: HTTP client for API requests
- **google_generative_ai**: Google's Generative AI for expense insights

## System Integration
- **permission_handler**: Device permission management

## Web Server
- **shelf**: HTTP server framework
- **shelf_static**: Static file serving

## Utilities
- **intl**: Internationalization and date formatting
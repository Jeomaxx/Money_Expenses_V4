import 'dart:io';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as shelf_io;
import 'package:shelf_static/shelf_static.dart';

void main() async {
  // Get port from environment variable, defaulting to 5000
  final port = int.parse(Platform.environment['PORT'] ?? '5000');
  
  // Create a handler for static files (serve from web/ directory)
  final staticHandler = createStaticHandler(
    'web',
    defaultDocument: 'index.html',
    listDirectories: false,
  );
  
  // Simple fallback for SPA routing - serve index.html for HTML requests
  Handler spaFallback = (request) {
    // Only serve index.html for GET requests that accept HTML
    if (request.method == 'GET') {
      final acceptHeader = request.headers['accept'] ?? '';
      if (acceptHeader.contains('text/html')) {
        // Serve the same index.html file that static handler serves
        final file = File('web/index.html');
        if (file.existsSync()) {
          return Response.ok(
            file.readAsStringSync(),
            headers: {'content-type': 'text/html; charset=utf-8'},
          );
        }
      }
    }
    // Return 404 for non-HTML requests and missing assets
    return Response.notFound('Not Found');
  };
  
  // Create a cascade handler (static files first, then SPA fallback)
  final cascadeHandler = Cascade()
    .add(staticHandler)
    .add(spaFallback)
    .handler;
  
  // Add basic middleware
  final handler = Pipeline()
    .addMiddleware(logRequests())
    .addHandler(cascadeHandler);
  
  // Start the server
  final server = await shelf_io.serve(
    handler,
    '0.0.0.0',
    port,
  );
  
  print('Professional Expense Manager server running on http://\${server.address.host}:\${server.port}');
  print('Serving static files from web/ directory');
}
import 'dart:convert';

import 'package:http/http.dart' as http;

class LiveIpoService {
  LiveIpoService({
    this.endpoint = 'https://niveco-pro-7.vercel.app/api/ipos',
    http.Client? client,
  }) : _client = client ?? http.Client();

  final String endpoint;
  final http.Client _client;

  Future<LiveIpoResponse> fetch() async {
    final uri = Uri.parse(endpoint).replace(queryParameters: {
      't': DateTime.now().millisecondsSinceEpoch.toString(),
    });
    final response = await _client
        .get(uri, headers: const {'Accept': 'application/json'})
        .timeout(const Duration(seconds: 20));

    final dynamic decoded = jsonDecode(response.body);
    final body = decoded is Map<String, dynamic>
        ? decoded
        : <String, dynamic>{'records': const []};

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw LiveIpoException(
        body['error']?.toString() ?? 'Live IPO server error',
        detail: body['detail']?.toString(),
        code: body['code']?.toString(),
      );
    }

    final rows = body['records'];
    return LiveIpoResponse(
      source: body['source']?.toString() ?? 'Live IPO API',
      updatedAt: DateTime.tryParse(body['updatedAt']?.toString() ?? ''),
      records: rows is List
          ? rows.whereType<Map>().map((e) => Map<String, dynamic>.from(e)).toList()
          : const [],
    );
  }
}

class LiveIpoResponse {
  const LiveIpoResponse({
    required this.source,
    required this.records,
    this.updatedAt,
  });

  final String source;
  final DateTime? updatedAt;
  final List<Map<String, dynamic>> records;
}

class LiveIpoException implements Exception {
  const LiveIpoException(this.message, {this.detail, this.code});

  final String message;
  final String? detail;
  final String? code;

  @override
  String toString() => detail == null ? message : '$message: $detail';
}

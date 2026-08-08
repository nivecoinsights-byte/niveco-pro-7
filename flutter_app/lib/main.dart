import 'package:flutter/material.dart';

void main() {
  runApp(const NivecoApp());
}

class NivecoApp extends StatefulWidget {
  const NivecoApp({super.key});

  @override
  State<NivecoApp> createState() => _NivecoAppState();
}

class _NivecoAppState extends State<NivecoApp> {
  bool gujarati = false;

  @override
  Widget build(BuildContext context) {
    const seed = Color(0xFF0B63F6);
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'NIVECO Insights',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: seed, brightness: Brightness.dark),
        scaffoldBackgroundColor: const Color(0xFF06111F),
        cardColor: const Color(0xFF0D1B2B),
        useMaterial3: true,
      ),
      home: HomePage(
        gujarati: gujarati,
        onLanguageChanged: (value) => setState(() => gujarati = value),
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({
    super.key,
    required this.gujarati,
    required this.onLanguageChanged,
  });

  final bool gujarati;
  final ValueChanged<bool> onLanguageChanged;

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int index = 0;
  final saved = <String>{};

  String tr(String en, String gu) => widget.gujarati ? gu : en;

  @override
  Widget build(BuildContext context) {
    final pages = [
      IpoPage(gujarati: widget.gujarati, saved: saved, onSave: _toggleSaved),
      BidsPage(gujarati: widget.gujarati),
      CalculatorPage(gujarati: widget.gujarati),
      SavedPage(gujarati: widget.gujarati, saved: saved),
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF071827),
        titleSpacing: 12,
        title: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.asset(
                'assets/niveco-eye.jpg',
                width: 42,
                height: 42,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('NIVECO', style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 2, fontSize: 15)),
                Text('INSIGHTS', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
              ],
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => widget.onLanguageChanged(!widget.gujarati),
            child: Text(widget.gujarati ? 'EN' : 'ગુ'),
          ),
          const SizedBox(width: 6),
        ],
      ),
      body: IndexedStack(index: index, children: pages),
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (value) => setState(() => index = value),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.candlestick_chart), label: tr('IPO', 'IPO')),
          NavigationDestination(icon: const Icon(Icons.show_chart), label: tr('Bids', 'બિડ્સ')),
          NavigationDestination(icon: const Icon(Icons.calculate_outlined), label: tr('Calc', 'કેલ્ક')),
          NavigationDestination(icon: const Icon(Icons.star_border), label: tr('Saved', 'સેવ્ડ')),
        ],
      ),
    );
  }

  void _toggleSaved(String name) {
    setState(() {
      saved.contains(name) ? saved.remove(name) : saved.add(name);
    });
  }
}

class IpoPage extends StatelessWidget {
  const IpoPage({super.key, required this.gujarati, required this.saved, required this.onSave});

  final bool gujarati;
  final Set<String> saved;
  final ValueChanged<String> onSave;

  String tr(String en, String gu) => gujarati ? gu : en;

  @override
  Widget build(BuildContext context) {
    final items = const [
      ('Demo Mainboard IPO', 'MAINBOARD', '₹210–₹225', 'Open soon'),
      ('Demo SME IPO', 'SME', '₹92–₹96', 'Upcoming'),
    ];

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(tr('Mainboard & SME IPOs', 'મેઈનબોર્ડ અને SME IPO'), style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
          const SizedBox(height: 6),
          Text(tr('Fresh Flutter build. Live data will be connected after the app shell is stable.', 'આ નવું Flutter build છે. App stable થયા પછી live data જોડશું.'), style: const TextStyle(color: Colors.white70)),
          const SizedBox(height: 16),
          TextField(
            decoration: InputDecoration(
              hintText: tr('Search company or ticker', 'કંપની અથવા ટિકર શોધો'),
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
            ),
          ),
          const SizedBox(height: 16),
          ...items.map((item) {
            final isSaved = saved.contains(item.$1);
            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(color: Colors.blue.withValues(alpha: .16), borderRadius: BorderRadius.circular(20)),
                          child: Text(item.$2, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                        ),
                        const Spacer(),
                        IconButton(onPressed: () => onSave(item.$1), icon: Icon(isSaved ? Icons.star : Icons.star_border)),
                      ],
                    ),
                    Text(item.$1, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _Info(label: tr('Price band', 'પ્રાઇસ બેન્ડ'), value: item.$3),
                        _Info(label: tr('Status', 'સ્ટેટસ'), value: item.$4),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _Info extends StatelessWidget {
  const _Info({required this.label, required this.value});
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white54, fontSize: 12)),
        const SizedBox(height: 3),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w700)),
      ],
    );
  }
}

class BidsPage extends StatelessWidget {
  const BidsPage({super.key, required this.gujarati});
  final bool gujarati;
  String tr(String en, String gu) => gujarati ? gu : en;

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.show_chart, size: 64),
              const SizedBox(height: 12),
              Text(tr('Subscription tracking', 'સબ્સ્ક્રિપ્શન ટ્રેકિંગ'), style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 8),
              Text(tr('This section will show category-wise IPO bids after live data integration.', 'Live data જોડ્યા પછી અહીં category-wise IPO bids દેખાશે.'), textAlign: TextAlign.center),
            ],
          ),
        ),
      );
}

class CalculatorPage extends StatefulWidget {
  const CalculatorPage({super.key, required this.gujarati});
  final bool gujarati;

  @override
  State<CalculatorPage> createState() => _CalculatorPageState();
}

class _CalculatorPageState extends State<CalculatorPage> {
  final price = TextEditingController();
  final lots = TextEditingController(text: '1');
  final lotSize = TextEditingController(text: '1');
  double total = 0;

  String tr(String en, String gu) => widget.gujarati ? gu : en;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(tr('IPO Investment Calculator', 'IPO ઇન્વેસ્ટમેન્ટ કેલ્ક્યુલેટર'), style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
        const SizedBox(height: 18),
        _field(price, tr('Upper price ₹', 'અપર પ્રાઇસ ₹')),
        const SizedBox(height: 12),
        _field(lotSize, tr('Lot size', 'લોટ સાઇઝ')),
        const SizedBox(height: 12),
        _field(lots, tr('Number of lots', 'લોટની સંખ્યા')),
        const SizedBox(height: 16),
        FilledButton(
          onPressed: () {
            final p = double.tryParse(price.text) ?? 0;
            final s = double.tryParse(lotSize.text) ?? 0;
            final l = double.tryParse(lots.text) ?? 0;
            setState(() => total = p * s * l);
          },
          child: Text(tr('Calculate', 'ગણતરી કરો')),
        ),
        const SizedBox(height: 18),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Text('${tr('Estimated investment', 'અંદાજિત રોકાણ')}: ₹${total.toStringAsFixed(2)}', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w800)),
          ),
        ),
      ],
    );
  }

  Widget _field(TextEditingController controller, String label) => TextField(
        controller: controller,
        keyboardType: const TextInputType.numberWithOptions(decimal: true),
        decoration: InputDecoration(labelText: label, border: OutlineInputBorder(borderRadius: BorderRadius.circular(14))),
      );
}

class SavedPage extends StatelessWidget {
  const SavedPage({super.key, required this.gujarati, required this.saved});
  final bool gujarati;
  final Set<String> saved;
  String tr(String en, String gu) => gujarati ? gu : en;

  @override
  Widget build(BuildContext context) {
    if (saved.isEmpty) {
      return Center(child: Text(tr('No saved IPOs yet.', 'હજુ કોઈ IPO સેવ કરેલ નથી.')));
    }
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(tr('Saved IPOs', 'સેવ્ડ IPO'), style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
        const SizedBox(height: 12),
        ...saved.map((name) => Card(child: ListTile(leading: const Icon(Icons.star), title: Text(name))),
      ],
    );
  }
}

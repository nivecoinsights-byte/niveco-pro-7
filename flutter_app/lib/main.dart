import 'package:flutter/material.dart';

void main() => runApp(const NivecoApp());

class NivecoApp extends StatefulWidget {
  const NivecoApp({super.key});
  @override
  State<NivecoApp> createState() => _NivecoAppState();
}

class _NivecoAppState extends State<NivecoApp> {
  bool gujarati = false;
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'NIVECO Insights',
      theme: ThemeData.dark(useMaterial3: true).copyWith(
        scaffoldBackgroundColor: const Color(0xFF06111F),
        cardColor: const Color(0xFF0D1B2B),
      ),
      home: HomePage(
        gujarati: gujarati,
        onLanguageChanged: (v) => setState(() => gujarati = v),
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key, required this.gujarati, required this.onLanguageChanged});
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
    final pages = <Widget>[
      IpoPage(gujarati: widget.gujarati, saved: saved, onSave: toggleSaved),
      BidsPage(gujarati: widget.gujarati),
      CalculatorPage(gujarati: widget.gujarati),
      SavedPage(gujarati: widget.gujarati, saved: saved),
    ];
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF071827),
        title: Row(children: [
          Image.asset('assets/niveco-eye.png', width: 40, height: 40),
          const SizedBox(width: 10),
          const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('NIVECO', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 2)),
            Text('IPO & Market Insights', style: TextStyle(fontSize: 11)),
          ]),
        ]),
        actions: [
          TextButton(
            onPressed: () => widget.onLanguageChanged(!widget.gujarati),
            child: Text(widget.gujarati ? 'EN' : 'ગુજરાતી'),
          ),
        ],
      ),
      body: IndexedStack(index: index, children: pages),
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (v) => setState(() => index = v),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.home_outlined), label: tr('Home', 'હોમ')),
          NavigationDestination(icon: const Icon(Icons.show_chart), label: tr('Bids', 'બિડ્સ')),
          NavigationDestination(icon: const Icon(Icons.calculate_outlined), label: tr('Calc', 'કેલ્ક')),
          NavigationDestination(icon: const Icon(Icons.star_border), label: tr('Saved', 'સેવ્ડ')),
        ],
      ),
    );
  }

  void toggleSaved(String name) => setState(() {
        saved.contains(name) ? saved.remove(name) : saved.add(name);
      });
}

class IpoPage extends StatelessWidget {
  const IpoPage({super.key, required this.gujarati, required this.saved, required this.onSave});
  final bool gujarati;
  final Set<String> saved;
  final ValueChanged<String> onSave;
  String tr(String en, String gu) => gujarati ? gu : en;

  @override
  Widget build(BuildContext context) {
    const items = [
      ['Demo Mainboard IPO', 'MAINBOARD', '₹210–₹225', 'Open soon'],
      ['Demo SME IPO', 'SME', '₹92–₹96', 'Upcoming'],
    ];
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(tr('Current & Upcoming IPOs', 'ચાલુ અને આગામી IPO'), style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 12),
        TextField(decoration: InputDecoration(hintText: tr('Search IPO company...', 'IPO કંપની શોધો...'), prefixIcon: const Icon(Icons.search), border: const OutlineInputBorder())),
        const SizedBox(height: 16),
        ...items.map((item) {
          final isSaved = saved.contains(item[0]);
          return Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Text(item[1], style: const TextStyle(fontWeight: FontWeight.bold)),
                  const Spacer(),
                  IconButton(onPressed: () => onSave(item[0]), icon: Icon(isSaved ? Icons.star : Icons.star_border)),
                ]),
                Text(item[0], style: const TextStyle(fontSize: 19, fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                Text('${tr('Price band', 'પ્રાઇસ બેન્ડ')}: ${item[2]}'),
                Text('${tr('Status', 'સ્ટેટસ')}: ${item[3]}'),
              ]),
            ),
          );
        }),
      ],
    );
  }
}

class BidsPage extends StatelessWidget {
  const BidsPage({super.key, required this.gujarati});
  final bool gujarati;
  @override
  Widget build(BuildContext context) => Center(child: Text(gujarati ? 'સબ્સ્ક્રિપ્શન ટ્રેકિંગ' : 'Subscription tracking'));
}

class CalculatorPage extends StatefulWidget {
  const CalculatorPage({super.key, required this.gujarati});
  final bool gujarati;
  @override
  State<CalculatorPage> createState() => _CalculatorPageState();
}

class _CalculatorPageState extends State<CalculatorPage> {
  final price = TextEditingController();
  final lotSize = TextEditingController(text: '1');
  final lots = TextEditingController(text: '1');
  double total = 0;
  String tr(String en, String gu) => widget.gujarati ? gu : en;
  @override
  Widget build(BuildContext context) => ListView(padding: const EdgeInsets.all(16), children: [
        Text(tr('IPO Investment Calculator', 'IPO ઇન્વેસ્ટમેન્ટ કેલ્ક્યુલેટર'), style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 16),
        field(price, tr('Upper price', 'અપર પ્રાઇસ')),
        const SizedBox(height: 10),
        field(lotSize, tr('Lot size', 'લોટ સાઇઝ')),
        const SizedBox(height: 10),
        field(lots, tr('Number of lots', 'લોટની સંખ્યા')),
        const SizedBox(height: 14),
        FilledButton(onPressed: () {
          final p = double.tryParse(price.text) ?? 0;
          final s = double.tryParse(lotSize.text) ?? 0;
          final l = double.tryParse(lots.text) ?? 0;
          setState(() => total = p * s * l);
        }, child: Text(tr('Calculate', 'ગણતરી કરો'))),
        const SizedBox(height: 16),
        Text('${tr('Estimated investment', 'અંદાજિત રોકાણ')}: ₹${total.toStringAsFixed(2)}'),
      ]);

  Widget field(TextEditingController c, String label) => TextField(
        controller: c,
        keyboardType: const TextInputType.numberWithOptions(decimal: true),
        decoration: InputDecoration(labelText: label, border: const OutlineInputBorder()),
      );
}

class SavedPage extends StatelessWidget {
  const SavedPage({super.key, required this.gujarati, required this.saved});
  final bool gujarati;
  final Set<String> saved;
  @override
  Widget build(BuildContext context) {
    if (saved.isEmpty) return Center(child: Text(gujarati ? 'હજુ કોઈ IPO સેવ નથી.' : 'No saved IPOs yet.'));
    return ListView(padding: const EdgeInsets.all(16), children: saved.map((n) => Card(child: ListTile(leading: const Icon(Icons.star), title: Text(n)))).toList());
  }
}

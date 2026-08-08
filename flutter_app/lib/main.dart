import 'package:flutter/material.dart';

void main() => runApp(const NivecoApp());

class NivecoApp extends StatefulWidget {
  const NivecoApp({super.key});
  @override
  State<NivecoApp> createState() => _NivecoAppState();
}

class _NivecoAppState extends State<NivecoApp> {
  bool gujarati = false;
  bool dark = true;

  @override
  Widget build(BuildContext context) {
    const seed = Color(0xFF6E55E8);
    final scheme = ColorScheme.fromSeed(
      seedColor: seed,
      brightness: dark ? Brightness.dark : Brightness.light,
      surface: dark ? const Color(0xFF0B1B2B) : const Color(0xFFF7F8FC),
    );
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'NIVECO Insights',
      theme: ThemeData(useMaterial3: true, colorScheme: scheme).copyWith(
        scaffoldBackgroundColor: dark ? const Color(0xFF06111F) : const Color(0xFFF7F8FC),
        cardTheme: CardThemeData(
          color: dark ? const Color(0xFF0D1B2B) : Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22), side: BorderSide(color: dark ? const Color(0xFF233B55) : const Color(0xFFE1E5EE))),
        ),
        navigationBarTheme: NavigationBarThemeData(
          backgroundColor: dark ? const Color(0xFF0B1B2B) : Colors.white,
          indicatorColor: seed.withValues(alpha: .25),
        ),
      ),
      home: NivecoShell(
        gujarati: gujarati,
        dark: dark,
        onLanguageChanged: (v) => setState(() => gujarati = v),
        onThemeChanged: (v) => setState(() => dark = v),
      ),
    );
  }
}

class Ipo {
  const Ipo({
    required this.id,
    required this.name,
    required this.type,
    required this.status,
    required this.priceBand,
    required this.lotSize,
    required this.subscription,
    required this.gmp,
    required this.gmpPct,
    required this.openDate,
    required this.closeDate,
    required this.allotmentDate,
    required this.listingDate,
    required this.issueSize,
    this.listingPrice,
    this.listingGain,
  });
  final String id;
  final String name;
  final String type;
  final String status;
  final String priceBand;
  final int lotSize;
  final double subscription;
  final int gmp;
  final double gmpPct;
  final String openDate;
  final String closeDate;
  final String allotmentDate;
  final String listingDate;
  final String issueSize;
  final int? listingPrice;
  final double? listingGain;
}

const demoIpos = <Ipo>[
  Ipo(
    id: 'anawil', name: 'Anawil Wire and Engineering', type: 'MAINBOARD', status: 'Upcoming',
    priceBand: '₹257–₹270', lotSize: 400, subscription: 0, gmp: 80, gmpPct: 29.6,
    openDate: '03 Aug 2026', closeDate: '05 Aug 2026', allotmentDate: '06 Aug 2026', listingDate: '10 Aug 2026', issueSize: '—',
  ),
  Ipo(
    id: 'demo-main', name: 'Demo Mainboard IPO', type: 'MAINBOARD', status: 'Open',
    priceBand: '₹210–₹225', lotSize: 65, subscription: 7.42, gmp: 42, gmpPct: 18.7,
    openDate: '08 Aug 2026', closeDate: '11 Aug 2026', allotmentDate: '12 Aug 2026', listingDate: '14 Aug 2026', issueSize: '₹525 Cr',
  ),
  Ipo(
    id: 'demo-sme', name: 'Demo SME IPO', type: 'SME', status: 'Upcoming',
    priceBand: '₹92–₹96', lotSize: 1200, subscription: 0, gmp: 16, gmpPct: 16.7,
    openDate: '12 Aug 2026', closeDate: '14 Aug 2026', allotmentDate: '17 Aug 2026', listingDate: '19 Aug 2026', issueSize: '₹78 Cr',
  ),
  Ipo(
    id: 'listed-demo', name: 'NIVECO Listed Demo', type: 'MAINBOARD', status: 'Listed',
    priceBand: '₹300–₹315', lotSize: 45, subscription: 22.18, gmp: 0, gmpPct: 0,
    openDate: '27 Jul 2026', closeDate: '29 Jul 2026', allotmentDate: '30 Jul 2026', listingDate: '03 Aug 2026', issueSize: '₹690 Cr', listingPrice: 372, listingGain: 18.1,
  ),
];

class NivecoShell extends StatefulWidget {
  const NivecoShell({super.key, required this.gujarati, required this.dark, required this.onLanguageChanged, required this.onThemeChanged});
  final bool gujarati;
  final bool dark;
  final ValueChanged<bool> onLanguageChanged;
  final ValueChanged<bool> onThemeChanged;
  @override
  State<NivecoShell> createState() => _NivecoShellState();
}

class _NivecoShellState extends State<NivecoShell> {
  int index = 0;
  final saved = <String>{};
  String tr(String en, String gu) => widget.gujarati ? gu : en;

  @override
  Widget build(BuildContext context) {
    final pages = [
      HomeDashboard(gujarati: widget.gujarati, saved: saved, onToggleSaved: toggleSaved),
      IpoListPage(gujarati: widget.gujarati, saved: saved, onToggleSaved: toggleSaved),
      CalendarPage(gujarati: widget.gujarati),
      CalculatorPage(gujarati: widget.gujarati),
      MorePage(gujarati: widget.gujarati, dark: widget.dark, onThemeChanged: widget.onThemeChanged),
    ];
    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 82,
        backgroundColor: widget.dark ? const Color(0xFF071827) : Colors.white,
        titleSpacing: 14,
        title: Row(children: [
          Image.asset('assets/niveco-eye.png', width: 42, height: 42),
          const SizedBox(width: 10),
          const Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('NIVECO', style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 2.6, fontSize: 26)),
            Text('IPO & Market Insights', style: TextStyle(fontSize: 12, color: Colors.blueGrey)),
          ]),
        ]),
        actions: [
          IconButton(onPressed: () => widget.onThemeChanged(!widget.dark), icon: Icon(widget.dark ? Icons.light_mode_outlined : Icons.dark_mode_outlined)),
          TextButton(onPressed: () => widget.onLanguageChanged(!widget.gujarati), child: Text(widget.gujarati ? 'EN' : 'ગુજરાતી', style: const TextStyle(fontWeight: FontWeight.w700))),
          const SizedBox(width: 6),
        ],
      ),
      body: IndexedStack(index: index, children: pages),
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (v) => setState(() => index = v),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.home_outlined), selectedIcon: const Icon(Icons.home), label: tr('Home', 'હોમ')),
          NavigationDestination(icon: const Icon(Icons.list_alt_outlined), selectedIcon: const Icon(Icons.list_alt), label: tr('IPOs', 'IPO')),
          NavigationDestination(icon: const Icon(Icons.calendar_month_outlined), selectedIcon: const Icon(Icons.calendar_month), label: tr('Calendar', 'કેલેન્ડર')),
          NavigationDestination(icon: const Icon(Icons.calculate_outlined), selectedIcon: const Icon(Icons.calculate), label: tr('Calc', 'કેલ્ક')),
          NavigationDestination(icon: const Icon(Icons.menu), label: tr('More', 'વધુ')),
        ],
      ),
    );
  }

  void toggleSaved(String id) => setState(() => saved.contains(id) ? saved.remove(id) : saved.add(id));
}

class HomeDashboard extends StatefulWidget {
  const HomeDashboard({super.key, required this.gujarati, required this.saved, required this.onToggleSaved});
  final bool gujarati;
  final Set<String> saved;
  final ValueChanged<String> onToggleSaved;
  @override
  State<HomeDashboard> createState() => _HomeDashboardState();
}

class _HomeDashboardState extends State<HomeDashboard> {
  bool listed = false;
  String query = '';
  String tr(String en, String gu) => widget.gujarati ? gu : en;

  @override
  Widget build(BuildContext context) {
    final items = demoIpos.where((i) {
      final groupOk = listed ? i.status == 'Listed' : i.status != 'Listed';
      return groupOk && i.name.toLowerCase().contains(query.toLowerCase());
    }).toList();
    return ListView(
      padding: const EdgeInsets.fromLTRB(18, 18, 18, 28),
      children: [
        SegmentedButton<bool>(
          segments: [
            ButtonSegment(value: false, label: Text(tr('Current & Upcoming', 'ચાલુ અને આગામી'))),
            ButtonSegment(value: true, label: Text(tr('Listed', 'લિસ્ટેડ'))),
          ],
          selected: {listed},
          onSelectionChanged: (s) => setState(() => listed = s.first),
          showSelectedIcon: false,
          style: const ButtonStyle(visualDensity: VisualDensity(vertical: 5)),
        ),
        const SizedBox(height: 18),
        TextField(
          onChanged: (v) => setState(() => query = v),
          decoration: InputDecoration(
            hintText: tr('Search IPO company...', 'IPO કંપની શોધો...'),
            prefixIcon: const Icon(Icons.search),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(18)),
          ),
        ),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(18),
            child: Row(children: [
              Container(width: 18, height: 18, decoration: const BoxDecoration(color: Color(0xFF16C784), shape: BoxShape.circle)),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('${tr('Live', 'લાઇવ')} • ${demoIpos.length} ${tr('IPO records', 'IPO રેકોર્ડ')}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
                Text(tr('Working Flutter base • migration in progress', 'Flutter આધાર કાર્યરત • માઇગ્રેશન ચાલુ'), style: const TextStyle(color: Colors.blueGrey)),
              ])),
              IconButton(onPressed: () => setState(() {}), icon: const Icon(Icons.refresh)),
            ]),
          ),
        ),
        const SizedBox(height: 10),
        ...items.map((i) => IpoCard(ipo: i, gujarati: widget.gujarati, saved: widget.saved.contains(i.id), onSave: () => widget.onToggleSaved(i.id))),
      ],
    );
  }
}

class IpoListPage extends StatefulWidget {
  const IpoListPage({super.key, required this.gujarati, required this.saved, required this.onToggleSaved});
  final bool gujarati;
  final Set<String> saved;
  final ValueChanged<String> onToggleSaved;
  @override
  State<IpoListPage> createState() => _IpoListPageState();
}

class _IpoListPageState extends State<IpoListPage> {
  String filter = 'All';
  String tr(String en, String gu) => widget.gujarati ? gu : en;
  @override
  Widget build(BuildContext context) {
    final items = demoIpos.where((i) => filter == 'All' || i.type == filter || (filter == 'Watchlist' && widget.saved.contains(i.id))).toList();
    return ListView(padding: const EdgeInsets.all(18), children: [
      Text(tr('IPO List', 'IPO યાદી'), style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
      const SizedBox(height: 14),
      Wrap(spacing: 8, runSpacing: 8, children: ['All', 'MAINBOARD', 'SME', 'Watchlist'].map((f) => ChoiceChip(label: Text(f), selected: filter == f, onSelected: (_) => setState(() => filter = f))).toList()),
      const SizedBox(height: 16),
      ...items.map((i) => IpoCard(ipo: i, gujarati: widget.gujarati, saved: widget.saved.contains(i.id), onSave: () => widget.onToggleSaved(i.id))),
    ]);
  }
}

class IpoCard extends StatelessWidget {
  const IpoCard({super.key, required this.ipo, required this.gujarati, required this.saved, required this.onSave});
  final Ipo ipo;
  final bool gujarati;
  final bool saved;
  final VoidCallback onSave;
  String tr(String en, String gu) => gujarati ? gu : en;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      child: InkWell(
        borderRadius: BorderRadius.circular(22),
        onTap: () => showModalBottomSheet(context: context, isScrollControlled: true, showDragHandle: true, builder: (_) => IpoDetailsSheet(ipo: ipo, gujarati: gujarati)),
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              CircleAvatar(radius: 26, child: Text(ipo.name.split(' ').where((x) => x.isNotEmpty).take(2).map((x) => x[0]).join())),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(ipo.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800)),
                const SizedBox(height: 4),
                Text('${tr('Offer', 'ઓફર')}: ${ipo.openDate} – ${ipo.closeDate}', style: const TextStyle(color: Colors.blueGrey)),
              ])),
              Column(children: [
                Chip(label: Text(ipo.status, style: const TextStyle(fontWeight: FontWeight.w700))),
                IconButton(onPressed: onSave, icon: Icon(saved ? Icons.star : Icons.star_border)),
              ]),
            ]),
            const SizedBox(height: 18),
            GridView.count(
              crossAxisCount: 2,
              childAspectRatio: 2.55,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                Stat(label: tr('Offer Price', 'ઓફર ભાવ'), value: ipo.priceBand),
                Stat(label: tr('Lot size', 'લોટ સાઇઝ'), value: '${ipo.lotSize}'),
                Stat(label: tr('Subscription', 'સબ્સ્ક્રિપ્શન'), value: '${ipo.subscription.toStringAsFixed(2)}x'),
                Stat(label: tr('GMP / Premium', 'GMP / પ્રીમિયમ'), value: '₹${ipo.gmp} (${ipo.gmpPct.toStringAsFixed(1)}%)', positive: ipo.gmp > 0),
                Stat(label: tr('Issue size', 'ઇશ્યૂ સાઇઝ'), value: ipo.issueSize),
                Stat(label: tr('Allotment', 'એલોટમેન્ટ'), value: ipo.allotmentDate),
              ],
            ),
          ]),
        ),
      ),
    );
  }
}

class Stat extends StatelessWidget {
  const Stat({super.key, required this.label, required this.value, this.positive = false});
  final String label;
  final String value;
  final bool positive;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 3),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: const TextStyle(color: Colors.blueGrey, fontSize: 12)),
      const SizedBox(height: 3),
      Text(value, style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16, color: positive ? const Color(0xFF18B77A) : null)),
    ]),
  );
}

class IpoDetailsSheet extends StatelessWidget {
  const IpoDetailsSheet({super.key, required this.ipo, required this.gujarati});
  final Ipo ipo;
  final bool gujarati;
  String tr(String en, String gu) => gujarati ? gu : en;
  @override
  Widget build(BuildContext context) => SafeArea(
    child: Padding(
      padding: EdgeInsets.fromLTRB(20, 4, 20, 20 + MediaQuery.of(context).viewInsets.bottom),
      child: ListView(shrinkWrap: true, children: [
        Text(ipo.name, style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
        const SizedBox(height: 6),
        Text('${ipo.type} • ${ipo.status}', style: const TextStyle(color: Colors.blueGrey)),
        const Divider(height: 28),
        detailsRow(tr('Price Band', 'પ્રાઇસ બેન્ડ'), ipo.priceBand),
        detailsRow(tr('Lot Size', 'લોટ સાઇઝ'), '${ipo.lotSize}'),
        detailsRow(tr('Subscription', 'સબ્સ્ક્રિપ્શન'), '${ipo.subscription.toStringAsFixed(2)}x'),
        detailsRow('GMP', '₹${ipo.gmp} (${ipo.gmpPct.toStringAsFixed(1)}%)'),
        detailsRow(tr('Open', 'ઓપન'), ipo.openDate),
        detailsRow(tr('Close', 'ક્લોઝ'), ipo.closeDate),
        detailsRow(tr('Allotment', 'એલોટમેન્ટ'), ipo.allotmentDate),
        detailsRow(tr('Listing', 'લિસ્ટિંગ'), ipo.listingDate),
        detailsRow(tr('Issue Size', 'ઇશ્યૂ સાઇઝ'), ipo.issueSize),
        if (ipo.listingPrice != null) detailsRow(tr('Listing Price', 'લિસ્ટિંગ ભાવ'), '₹${ipo.listingPrice}'),
        if (ipo.listingGain != null) detailsRow(tr('Listing Gain', 'લિસ્ટિંગ ગેઇન'), '${ipo.listingGain!.toStringAsFixed(1)}%'),
        const SizedBox(height: 14),
        Text(tr('Market data must be independently verified before investing.', 'રોકાણ કરતા પહેલાં માર્કેટ ડેટાની સ્વતંત્ર રીતે ચકાસણી કરવી.'), style: const TextStyle(color: Colors.blueGrey, fontSize: 12)),
      ]),
    ),
  );

  Widget detailsRow(String a, String b) => Padding(
    padding: const EdgeInsets.symmetric(vertical: 8),
    child: Row(children: [Expanded(child: Text(a, style: const TextStyle(color: Colors.blueGrey))), Text(b, style: const TextStyle(fontWeight: FontWeight.w700))]),
  );
}

class CalendarPage extends StatelessWidget {
  const CalendarPage({super.key, required this.gujarati});
  final bool gujarati;
  String tr(String en, String gu) => gujarati ? gu : en;
  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(18),
    children: [
      Text(tr('IPO Calendar', 'IPO કેલેન્ડર'), style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
      const SizedBox(height: 8),
      Text(tr('Offer windows, allotment and listing dates', 'ઓફર, એલોટમેન્ટ અને લિસ્ટિંગ તારીખો'), style: const TextStyle(color: Colors.blueGrey)),
      const SizedBox(height: 18),
      ...demoIpos.map((i) => Card(child: ListTile(
        leading: const Icon(Icons.event_note),
        title: Text(i.name, style: const TextStyle(fontWeight: FontWeight.w700)),
        subtitle: Text('${tr('Open', 'ઓપન')}: ${i.openDate}\n${tr('Allotment', 'એલોટમેન્ટ')}: ${i.allotmentDate}\n${tr('Listing', 'લિસ્ટિંગ')}: ${i.listingDate}'),
        isThreeLine: true,
      ))),
    ],
  );
}

class CalculatorPage extends StatefulWidget {
  const CalculatorPage({super.key, required this.gujarati});
  final bool gujarati;
  @override
  State<CalculatorPage> createState() => _CalculatorPageState();
}

class _CalculatorPageState extends State<CalculatorPage> {
  final price = TextEditingController(text: '225');
  final lotSize = TextEditingController(text: '65');
  final lots = TextEditingController(text: '1');
  double total = 14625;
  String tr(String en, String gu) => widget.gujarati ? gu : en;
  @override
  Widget build(BuildContext context) => ListView(padding: const EdgeInsets.all(18), children: [
    Text(tr('IPO Investment Calculator', 'IPO ઇન્વેસ્ટમેન્ટ કેલ્ક્યુલેટર'), style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
    const SizedBox(height: 18),
    field(price, tr('Upper price', 'અપર પ્રાઇસ')),
    const SizedBox(height: 12),
    field(lotSize, tr('Lot size', 'લોટ સાઇઝ')),
    const SizedBox(height: 12),
    field(lots, tr('Number of lots', 'લોટની સંખ્યા')),
    const SizedBox(height: 16),
    FilledButton(onPressed: calculate, style: FilledButton.styleFrom(minimumSize: const Size.fromHeight(54)), child: Text(tr('Calculate', 'ગણતરી કરો'))),
    const SizedBox(height: 18),
    Card(child: Padding(padding: const EdgeInsets.all(18), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(tr('Estimated investment', 'અંદાજિત રોકાણ'), style: const TextStyle(color: Colors.blueGrey)),
      const SizedBox(height: 6),
      Text('₹${total.toStringAsFixed(2)}', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800)),
    ]))),
  ]);

  void calculate() {
    final p = double.tryParse(price.text) ?? 0;
    final s = double.tryParse(lotSize.text) ?? 0;
    final l = double.tryParse(lots.text) ?? 0;
    setState(() => total = p * s * l);
  }

  Widget field(TextEditingController c, String label) => TextField(
    controller: c,
    keyboardType: const TextInputType.numberWithOptions(decimal: true),
    decoration: InputDecoration(labelText: label, border: OutlineInputBorder(borderRadius: BorderRadius.circular(14))),
  );
}

class MorePage extends StatelessWidget {
  const MorePage({super.key, required this.gujarati, required this.dark, required this.onThemeChanged});
  final bool gujarati;
  final bool dark;
  final ValueChanged<bool> onThemeChanged;
  String tr(String en, String gu) => gujarati ? gu : en;
  @override
  Widget build(BuildContext context) => ListView(padding: const EdgeInsets.all(18), children: [
    Text(tr('More', 'વધુ'), style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
    const SizedBox(height: 16),
    Card(child: Column(children: [
      ListTile(leading: const Icon(Icons.star_border), title: Text(tr('Watchlist', 'વોચલિસ્ટ')), subtitle: Text(tr('Saved IPOs are available from the IPO tab filter.', 'સેવ કરેલા IPO IPO ટેબના ફિલ્ટરમાં ઉપલબ્ધ છે.'))),
      const Divider(height: 1),
      ListTile(leading: const Icon(Icons.admin_panel_settings_outlined), title: Text(tr('Admin Panel', 'એડમિન પેનલ')), subtitle: Text(tr('Firebase admin migration is the next backend phase.', 'Firebase એડમિન માઇગ્રેશન આગળનો backend તબક્કો છે.'))),
      const Divider(height: 1),
      ListTile(leading: const Icon(Icons.download_outlined), title: Text(tr('Export Backup', 'એક્સપોર્ટ બેકઅપ')), subtitle: Text(tr('UI migrated; file backup wiring pending.', 'UI માઇગ્રેટ થયું; ફાઇલ બેકઅપ કનેક્શન બાકી છે.'))),
      const Divider(height: 1),
      ListTile(leading: const Icon(Icons.upload_outlined), title: Text(tr('Import Backup', 'ઇમ્પોર્ટ બેકઅપ')), subtitle: Text(tr('UI migrated; import engine pending.', 'UI માઇગ્રેટ થયું; ઇમ્પોર્ટ એન્જિન બાકી છે.'))),
      const Divider(height: 1),
      SwitchListTile(value: dark, onChanged: onThemeChanged, secondary: const Icon(Icons.contrast), title: Text(tr('Dark mode', 'ડાર્ક મોડ'))),
    ])),
    const SizedBox(height: 16),
    Card(child: Padding(padding: const EdgeInsets.all(18), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Row(children: [Image.asset('assets/niveco-eye.png', width: 34, height: 34), const SizedBox(width: 10), const Text('NIVECO', style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, letterSpacing: 2))]),
      const SizedBox(height: 8),
      Text(tr('Flutter migration base — native Android APK', 'Flutter માઇગ્રેશન આધાર — native Android APK'), style: const TextStyle(color: Colors.blueGrey)),
      const SizedBox(height: 6),
      const Text('NIVECO PRO • Flutter', style: TextStyle(fontWeight: FontWeight.w700)),
    ]))),
  ]);
}

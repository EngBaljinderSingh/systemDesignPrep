/**
 * monacoSetup.ts
 *
 * Configures Monaco Editor once (module-level guard prevents double registration):
 *  - Java: custom completion provider with common stdlib classes + snippets,
 *          automatic import insertion via additionalTextEdits
 *  - TypeScript: strict compiler options + inlay hints
 *  - JavaScript: checkJs, inlay hints
 */
import type * as Monaco from 'monaco-editor';

type MonacoInstance = typeof Monaco;

// ─── Module-level guards ──────────────────────────────────────────────────────
let javaProviderRegistered   = false;
let tsJsConfigApplied        = false;
let pythonProviderRegistered = false;
let cppProviderRegistered    = false;
let goProviderRegistered     = false;
let csharpProviderRegistered = false;

// ─── Java completion data ─────────────────────────────────────────────────────

interface JavaEntry {
  label: string;
  insertText: string;
  detail: string;
  documentation?: string;
  /** Fully-qualified class name to import, undefined for no-import items. */
  importFqn?: string;
  isSnippet?: boolean;
}

const JAVA_CLASSES: JavaEntry[] = [
  // ── java.util — collections ──────────────────────────────────────────────
  { label: 'ArrayList',       insertText: 'ArrayList<${1:E}>',           detail: 'java.util.ArrayList',           importFqn: 'java.util.ArrayList',           documentation: 'Resizable-array implementation of the List interface.' },
  { label: 'LinkedList',      insertText: 'LinkedList<${1:E}>',          detail: 'java.util.LinkedList',          importFqn: 'java.util.LinkedList',          documentation: 'Doubly-linked list implementing List and Deque.' },
  { label: 'HashMap',         insertText: 'HashMap<${1:K}, ${2:V}>',     detail: 'java.util.HashMap',             importFqn: 'java.util.HashMap',             documentation: 'Hash-table based Map; no insertion-order guarantee.' },
  { label: 'LinkedHashMap',   insertText: 'LinkedHashMap<${1:K}, ${2:V}>', detail: 'java.util.LinkedHashMap',     importFqn: 'java.util.LinkedHashMap',       documentation: 'Hash table + linked list — preserves insertion order.' },
  { label: 'TreeMap',         insertText: 'TreeMap<${1:K}, ${2:V}>',     detail: 'java.util.TreeMap',             importFqn: 'java.util.TreeMap',             documentation: 'Red-black tree NavigableMap, sorted by natural key order.' },
  { label: 'HashSet',         insertText: 'HashSet<${1:E}>',             detail: 'java.util.HashSet',             importFqn: 'java.util.HashSet',             documentation: 'Hash-table based Set, O(1) add/contains/remove.' },
  { label: 'LinkedHashSet',   insertText: 'LinkedHashSet<${1:E}>',       detail: 'java.util.LinkedHashSet',       importFqn: 'java.util.LinkedHashSet',       documentation: 'Hash table + linked list Set — preserves insertion order.' },
  { label: 'TreeSet',         insertText: 'TreeSet<${1:E}>',             detail: 'java.util.TreeSet',             importFqn: 'java.util.TreeSet',             documentation: 'Red-black tree NavigableSet, sorted.' },
  { label: 'PriorityQueue',   insertText: 'PriorityQueue<${1:E}>',       detail: 'java.util.PriorityQueue',       importFqn: 'java.util.PriorityQueue',       documentation: 'Min-heap based priority queue.' },
  { label: 'ArrayDeque',      insertText: 'ArrayDeque<${1:E}>',          detail: 'java.util.ArrayDeque',          importFqn: 'java.util.ArrayDeque',          documentation: 'Resizable-array deque; use instead of Stack.' },
  { label: 'Stack',           insertText: 'Stack<${1:E}>',               detail: 'java.util.Stack',               importFqn: 'java.util.Stack',               documentation: 'LIFO stack. Prefer ArrayDeque for new code.' },
  // ── java.util — interfaces ───────────────────────────────────────────────
  { label: 'List',            insertText: 'List<${1:E}>',                detail: 'java.util.List (interface)',    importFqn: 'java.util.List' },
  { label: 'Map',             insertText: 'Map<${1:K}, ${2:V}>',         detail: 'java.util.Map (interface)',     importFqn: 'java.util.Map' },
  { label: 'Set',             insertText: 'Set<${1:E}>',                 detail: 'java.util.Set (interface)',     importFqn: 'java.util.Set' },
  { label: 'Queue',           insertText: 'Queue<${1:E}>',               detail: 'java.util.Queue (interface)',   importFqn: 'java.util.Queue' },
  { label: 'Deque',           insertText: 'Deque<${1:E}>',               detail: 'java.util.Deque (interface)',   importFqn: 'java.util.Deque' },
  // ── java.util — utilities ────────────────────────────────────────────────
  { label: 'Collections',     insertText: 'Collections',                 detail: 'java.util.Collections',        importFqn: 'java.util.Collections',         documentation: 'Static utility methods for collections.' },
  { label: 'Arrays',          insertText: 'Arrays',                      detail: 'java.util.Arrays',              importFqn: 'java.util.Arrays',              documentation: 'Static utility methods for arrays.' },
  { label: 'Objects',         insertText: 'Objects',                     detail: 'java.util.Objects',             importFqn: 'java.util.Objects' },
  { label: 'Optional',        insertText: 'Optional<${1:T}>',            detail: 'java.util.Optional',            importFqn: 'java.util.Optional' },
  { label: 'Scanner',         insertText: 'Scanner',                     detail: 'java.util.Scanner',             importFqn: 'java.util.Scanner',             documentation: 'Simple text scanner for parsing primitives and strings.' },
  { label: 'Random',          insertText: 'Random',                      detail: 'java.util.Random',              importFqn: 'java.util.Random' },
  { label: 'StringJoiner',    insertText: 'StringJoiner',                detail: 'java.util.StringJoiner',        importFqn: 'java.util.StringJoiner' },
  { label: 'Comparator',      insertText: 'Comparator<${1:T}>',          detail: 'java.util.Comparator',          importFqn: 'java.util.Comparator' },
  // ── java.util.stream ─────────────────────────────────────────────────────
  { label: 'Stream',          insertText: 'Stream<${1:T}>',              detail: 'java.util.stream.Stream',       importFqn: 'java.util.stream.Stream' },
  { label: 'Collectors',      insertText: 'Collectors',                  detail: 'java.util.stream.Collectors',   importFqn: 'java.util.stream.Collectors' },
  { label: 'IntStream',       insertText: 'IntStream',                   detail: 'java.util.stream.IntStream',    importFqn: 'java.util.stream.IntStream' },
  { label: 'LongStream',      insertText: 'LongStream',                  detail: 'java.util.stream.LongStream',   importFqn: 'java.util.stream.LongStream' },
  // ── java.util.function ───────────────────────────────────────────────────
  { label: 'Function',        insertText: 'Function<${1:T}, ${2:R}>',    detail: 'java.util.function.Function',   importFqn: 'java.util.function.Function' },
  { label: 'BiFunction',      insertText: 'BiFunction<${1:T}, ${2:U}, ${3:R}>', detail: 'java.util.function.BiFunction', importFqn: 'java.util.function.BiFunction' },
  { label: 'Predicate',       insertText: 'Predicate<${1:T}>',           detail: 'java.util.function.Predicate',  importFqn: 'java.util.function.Predicate' },
  { label: 'Consumer',        insertText: 'Consumer<${1:T}>',            detail: 'java.util.function.Consumer',   importFqn: 'java.util.function.Consumer' },
  { label: 'Supplier',        insertText: 'Supplier<${1:T}>',            detail: 'java.util.function.Supplier',   importFqn: 'java.util.function.Supplier' },
  { label: 'UnaryOperator',   insertText: 'UnaryOperator<${1:T}>',       detail: 'java.util.function.UnaryOperator', importFqn: 'java.util.function.UnaryOperator' },
  { label: 'BinaryOperator',  insertText: 'BinaryOperator<${1:T}>',      detail: 'java.util.function.BinaryOperator', importFqn: 'java.util.function.BinaryOperator' },
  // ── java.io ──────────────────────────────────────────────────────────────
  { label: 'BufferedReader',  insertText: 'BufferedReader',              detail: 'java.io.BufferedReader',        importFqn: 'java.io.BufferedReader' },
  { label: 'PrintWriter',     insertText: 'PrintWriter',                 detail: 'java.io.PrintWriter',           importFqn: 'java.io.PrintWriter' },
  { label: 'InputStreamReader', insertText: 'InputStreamReader',         detail: 'java.io.InputStreamReader',     importFqn: 'java.io.InputStreamReader' },
  { label: 'IOException',     insertText: 'IOException',                 detail: 'java.io.IOException',           importFqn: 'java.io.IOException' },
  // ── java.util.concurrent ─────────────────────────────────────────────────
  { label: 'ConcurrentHashMap', insertText: 'ConcurrentHashMap<${1:K}, ${2:V}>', detail: 'java.util.concurrent.ConcurrentHashMap', importFqn: 'java.util.concurrent.ConcurrentHashMap' },
  { label: 'AtomicInteger',   insertText: 'AtomicInteger',               detail: 'java.util.concurrent.atomic.AtomicInteger', importFqn: 'java.util.concurrent.atomic.AtomicInteger' },
  { label: 'AtomicLong',      insertText: 'AtomicLong',                  detail: 'java.util.concurrent.atomic.AtomicLong',    importFqn: 'java.util.concurrent.atomic.AtomicLong' },
];

const JAVA_SNIPPETS: JavaEntry[] = [
  // ── Output ───────────────────────────────────────────────────────────────
  { label: 'sout',      insertText: 'System.out.println(${1});',                                                        detail: 'System.out.println()',         isSnippet: true },
  { label: 'soutf',     insertText: 'System.out.printf("${1:%s}%n", ${2});',                                            detail: 'System.out.printf()',          isSnippet: true },
  { label: 'serr',      insertText: 'System.err.println(${1});',                                                        detail: 'System.err.println()',         isSnippet: true },
  // ── Loops ────────────────────────────────────────────────────────────────
  { label: 'fori',      insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3}\n}',                    detail: 'for-i loop',                   isSnippet: true },
  { label: 'forr',      insertText: 'for (int ${1:i} = ${2:n} - 1; ${1:i} >= 0; ${1:i}--) {\n\t${3}\n}',              detail: 'for-i reverse loop',           isSnippet: true },
  { label: 'foreach',   insertText: 'for (${1:var} ${2:item} : ${3:collection}) {\n\t${4}\n}',                          detail: 'enhanced for-each loop',       isSnippet: true },
  { label: 'while',     insertText: 'while (${1:condition}) {\n\t${2}\n}',                                              detail: 'while loop',                   isSnippet: true },
  { label: 'dowhile',   insertText: 'do {\n\t${1}\n} while (${2:condition});',                                          detail: 'do-while loop',                isSnippet: true },
  // ── Control flow ─────────────────────────────────────────────────────────
  { label: 'ifelse',    insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',                               detail: 'if-else block',                isSnippet: true },
  { label: 'switch',    insertText: 'switch (${1:expr}) {\n\tcase ${2:value}:\n\t\t${3}\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}', detail: 'switch statement',    isSnippet: true },
  { label: 'ternary',   insertText: '${1:condition} ? ${2:trueVal} : ${3:falseVal}',                                    detail: 'ternary expression',           isSnippet: true },
  // ── Exception handling ───────────────────────────────────────────────────
  { label: 'trycatch',  insertText: 'try {\n\t${1}\n} catch (${2:Exception} ${3:e}) {\n\t${4:e.printStackTrace();\n}', detail: 'try-catch',                    isSnippet: true },
  { label: 'tryres',    insertText: 'try (${1:Resource} ${2:res} = ${3}) {\n\t${4}\n} catch (${5:Exception} ${6:e}) {\n\t${7}\n}', detail: 'try-with-resources', isSnippet: true },
  // ── Method / class boilerplate ───────────────────────────────────────────
  { label: 'main',      insertText: 'public static void main(String[] args) {\n\t${1}\n}',                              detail: 'main method',                  isSnippet: true },
  { label: 'override',  insertText: '@Override\npublic ${1:void} ${2:method}(${3}) {\n\t${4}\n}',                       detail: '@Override method',             isSnippet: true },
  { label: 'lambda',    insertText: '(${1:x}) -> ${2:x}',                                                               detail: 'lambda expression',            isSnippet: true },
  // ── Common collection patterns ────────────────────────────────────────────
  { label: 'newlist',   insertText: 'List<${1:E}> ${2:list} = new ArrayList<>();',                                      detail: 'new ArrayList',                isSnippet: true },
  { label: 'newmap',    insertText: 'Map<${1:K}, ${2:V}> ${3:map} = new HashMap<>();',                                  detail: 'new HashMap',                  isSnippet: true },
  { label: 'newset',    insertText: 'Set<${1:E}> ${2:set} = new HashSet<>();',                                          detail: 'new HashSet',                  isSnippet: true },
  { label: 'newpq',     insertText: 'PriorityQueue<${1:E}> ${2:pq} = new PriorityQueue<>();',                           detail: 'new PriorityQueue (min-heap)', isSnippet: true },
  { label: 'newpqmax',  insertText: 'PriorityQueue<${1:E}> ${2:pq} = new PriorityQueue<>(Comparator.reverseOrder());', detail: 'new PriorityQueue (max-heap)', isSnippet: true },
  { label: 'newdeque',  insertText: 'Deque<${1:E}> ${2:dq} = new ArrayDeque<>();',                                     detail: 'new ArrayDeque as Deque',      isSnippet: true },
  { label: 'scanner',   insertText: 'Scanner ${1:sc} = new Scanner(System.in);\n${2:int n = sc.nextInt();}',            detail: 'new Scanner for stdin',        isSnippet: true },
  // ── Arrays & sorting ─────────────────────────────────────────────────────
  { label: 'sort',      insertText: 'Arrays.sort(${1:arr});',                                                           detail: 'Arrays.sort',                  isSnippet: true },
  { label: 'sortdesc',  insertText: 'Arrays.sort(${1:arr}, Comparator.reverseOrder());',                                detail: 'Arrays.sort descending',       isSnippet: true },
  { label: 'sortlist',  insertText: 'Collections.sort(${1:list});',                                                     detail: 'Collections.sort',             isSnippet: true },
  { label: 'bsearch',   insertText: 'Arrays.binarySearch(${1:arr}, ${2:target})',                                       detail: 'Arrays.binarySearch',          isSnippet: true },
  // ── Stream pipeline ───────────────────────────────────────────────────────
  { label: 'stream',    insertText: '${1:list}.stream()\n\t.filter(${2:x} -> ${3:true})\n\t.map(${4:x} -> ${5:x})\n\t.collect(Collectors.toList())', detail: 'Stream pipeline', isSnippet: true },
  { label: 'mapcount',  insertText: '${1:map}.getOrDefault(${2:key}, 0)',                                               detail: 'map.getOrDefault',             isSnippet: true },
  { label: 'mapput',    insertText: '${1:map}.put(${2:key}, ${1:map}.getOrDefault(${2:key}, 0) + 1);',                  detail: 'frequency map increment',      isSnippet: true },
];

// ─── Helper: find line to insert import after ────────────────────────────────

/**
 * Returns the 1-based line number after which a new import should be inserted.
 * Returns 0 when the file has no package/import statements (insert at line 1).
 */
function findImportInsertLine(text: string): number {
  const lines = text.split('\n');
  let lastKnownLine = 0;
  for (let i = 0; i < lines.length; i++) {
    const trim = lines[i].trim();
    if (trim.startsWith('package ') || trim.startsWith('import ')) {
      lastKnownLine = i + 1; // convert to 1-based
    } else if (
      trim.length > 0 &&
      !trim.startsWith('//') &&
      !trim.startsWith('/*') &&
      !trim.startsWith('*')
    ) {
      break; // hit first non-import/package/comment line
    }
  }
  return lastKnownLine;
}

// ─── Java completion provider ────────────────────────────────────────────────

// Monaco CompletionItem has no `data` field (unlike LSP), so we keep a
// module-level map from completion label → import FQN for resolveCompletionItem.
const javaImportMap = new Map<string, string>(
  JAVA_CLASSES.filter((c) => c.importFqn).map((c) => [c.label, c.importFqn!]),
);

function registerJavaCompletions(monaco: MonacoInstance): void {
  if (javaProviderRegistered) return;
  javaProviderRegistered = true;

  const { CompletionItemKind: CIK, CompletionItemInsertTextRule: CITR } = monaco.languages;

  monaco.languages.registerCompletionItemProvider('java', {
    triggerCharacters: ['.', ' ', '<', '@'],

    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber:   position.lineNumber,
        startColumn:     word.startColumn,
        endColumn:       word.endColumn,
      };

      const suggestions: Monaco.languages.CompletionItem[] = [
        // Class completions
        ...JAVA_CLASSES.map((cls) => ({
          label:            cls.label,
          kind:             CIK.Class,
          detail:           cls.detail,
          documentation:    cls.documentation ? { value: cls.documentation } : undefined,
          insertText:       cls.insertText,
          insertTextRules:  CITR.InsertAsSnippet,
          range,
        } satisfies Monaco.languages.CompletionItem)),

        // Snippet completions
        ...JAVA_SNIPPETS.map((snip) => ({
          label:           snip.label,
          kind:            CIK.Snippet,
          detail:          snip.detail,
          insertText:      snip.insertText,
          insertTextRules: CITR.InsertAsSnippet,
          range,
        } satisfies Monaco.languages.CompletionItem)),
      ];

      return { suggestions };
    },

    resolveCompletionItem(item) {
      const label = typeof item.label === 'string' ? item.label : item.label.label;
      const importFqn = javaImportMap.get(label);
      if (!importFqn) return item;

      // Find the active Java model (there should be one per editor instance)
      const model = monaco.editor.getModels().find((m) => m.getLanguageId() === 'java');
      if (!model) return item;

      const text = model.getValue();
      if (text.includes(`import ${importFqn}`)) return item; // already imported

      const lastLine  = findImportInsertLine(text);
      const totalLines = model.getLineCount();

      if (lastLine >= totalLines) {
        // Insert at end of file with a leading newline
        const col = model.getLineContent(totalLines).length + 1;
        item.additionalTextEdits = [{
          text:  `\nimport ${importFqn};`,
          range: { startLineNumber: totalLines, startColumn: col, endLineNumber: totalLines, endColumn: col },
        }];
      } else {
        // Insert at the start of the line immediately after the last import/package
        const insertLine = lastLine + 1;
        item.additionalTextEdits = [{
          text:  `import ${importFqn};\n`,
          range: { startLineNumber: insertLine, startColumn: 1, endLineNumber: insertLine, endColumn: 1 },
        }];
      }

      return item;
    },
  });
}

// ─── TypeScript / JavaScript configuration ───────────────────────────────────

// `monaco.languages.typescript` is typed as `{ deprecated: true }` in some
// @monaco-editor/react versions, but the API is fully functional at runtime.
// We extract what we need via a cast rather than fighting the broken type.
interface TsLanguageService {
  typescriptDefaults: {
    setCompilerOptions(opts: object): void;
    setDiagnosticsOptions(opts: object): void;
    setInlayHintsOptions(opts: object): void;
  };
  javascriptDefaults: {
    setCompilerOptions(opts: object): void;
    setDiagnosticsOptions(opts: object): void;
    setInlayHintsOptions(opts: object): void;
  };
  ScriptTarget:        Record<string, number>;
  ModuleKind:          Record<string, number>;
  JsxEmit:             Record<string, number>;
  ModuleResolutionKind: Record<string, number>;
}

function configureTypeScriptJavaScript(monaco: MonacoInstance): void {
  if (tsJsConfigApplied) return;
  tsJsConfigApplied = true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ts = (monaco.languages as any).typescript as TsLanguageService;

  const ScriptTarget         = ts.ScriptTarget;
  const ModuleKind           = ts.ModuleKind;
  const JsxEmit              = ts.JsxEmit;
  const ModuleResolutionKind = ts.ModuleResolutionKind;

  // ── TypeScript ────────────────────────────────────────────────────────────
  ts.typescriptDefaults.setCompilerOptions({
    target:                       ScriptTarget.ES2022,
    module:                       ModuleKind.ESNext,
    lib:                          ['es2022', 'dom', 'dom.iterable'],
    strict:                       true,
    esModuleInterop:              true,
    allowSyntheticDefaultImports: true,
    jsx:                          JsxEmit.React,
    moduleResolution:             ModuleResolutionKind.NodeJs,
    allowJs:                      true,
    resolveJsonModule:            true,
  });

  ts.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation:    false,
    noSyntaxValidation:      false,
    noSuggestionDiagnostics: false,
  });

  ts.typescriptDefaults.setInlayHintsOptions({
    includeInlayParameterNameHints:                         'all',
    includeInlayParameterNameHintsWhenArgumentMatchesName:  false,
    includeInlayFunctionParameterTypeHints:                 true,
    includeInlayVariableTypeHints:                          true,
    includeInlayPropertyDeclarationTypeHints:               true,
    includeInlayFunctionLikeReturnTypeHints:                true,
    includeInlayEnumMemberValueHints:                       true,
  });

  // ── JavaScript ────────────────────────────────────────────────────────────
  ts.javascriptDefaults.setCompilerOptions({
    target:                       ScriptTarget.ES2022,
    module:                       ModuleKind.CommonJS,
    lib:                          ['es2022', 'dom', 'dom.iterable'],
    allowJs:                      true,
    checkJs:                      true,
    esModuleInterop:              true,
    allowSyntheticDefaultImports: true,
    moduleResolution:             ModuleResolutionKind.NodeJs,
  });

  ts.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation:   false,
  });

  ts.javascriptDefaults.setInlayHintsOptions({
    includeInlayParameterNameHints:                         'literals',
    includeInlayParameterNameHintsWhenArgumentMatchesName:  false,
    includeInlayFunctionParameterTypeHints:                 true,
    includeInlayVariableTypeHints:                          false,
    includeInlayPropertyDeclarationTypeHints:               false,
    includeInlayFunctionLikeReturnTypeHints:                false,
    includeInlayEnumMemberValueHints:                       true,
  });
}

// ─── Python completion data ─────────────────────────────────────────────────

interface PyEntry { label: string; insertText: string; detail: string; documentation?: string; }

const PYTHON_BUILTINS: PyEntry[] = [
  { label: 'print',      insertText: 'print(${1})',                           detail: 'print(*objects, sep=" ", end="\\n")',       documentation: 'Print objects to text stream.' },
  { label: 'len',        insertText: 'len(${1})',                             detail: 'len(s) -> int',                             documentation: 'Return length of object.' },
  { label: 'range',      insertText: 'range(${1:stop})',                     detail: 'range(stop) | range(start, stop[, step])', documentation: 'Range of integers.' },
  { label: 'enumerate',  insertText: 'enumerate(${1:iterable})',             detail: 'enumerate(iterable, start=0)',              documentation: 'Returns (index, value) pairs.' },
  { label: 'zip',        insertText: 'zip(${1:iter1}, ${2:iter2})',         detail: 'zip(*iterables)',                           documentation: 'Zip iterables together.' },
  { label: 'map',        insertText: 'map(${1:func}, ${2:iterable})',       detail: 'map(function, iterable)',                  documentation: 'Apply function to each item.' },
  { label: 'filter',     insertText: 'filter(${1:func}, ${2:iterable})',    detail: 'filter(function, iterable)',               documentation: 'Filter items by function.' },
  { label: 'sorted',     insertText: 'sorted(${1:iterable})',               detail: 'sorted(iterable, *, key=None, reverse=False)', documentation: 'Return sorted list.' },
  { label: 'reversed',   insertText: 'reversed(${1:seq})',                  detail: 'reversed(sequence)',                       documentation: 'Return reversed iterator.' },
  { label: 'int',        insertText: 'int(${1})',                            detail: 'int(x=0)',                                 documentation: 'Convert to integer.' },
  { label: 'str',        insertText: 'str(${1})',                            detail: 'str(object="")',                          documentation: 'Convert to string.' },
  { label: 'float',      insertText: 'float(${1})',                          detail: 'float(x=0)',                               documentation: 'Convert to float.' },
  { label: 'bool',       insertText: 'bool(${1})',                           detail: 'bool(x=False)',                            documentation: 'Convert to boolean.' },
  { label: 'list',       insertText: 'list(${1})',                           detail: 'list(iterable=())',                        documentation: 'Create or convert to list.' },
  { label: 'dict',       insertText: 'dict(${1})',                           detail: 'dict(**kwargs)',                           documentation: 'Create or convert to dict.' },
  { label: 'set',        insertText: 'set(${1})',                            detail: 'set(iterable=())',                         documentation: 'Create set.' },
  { label: 'tuple',      insertText: 'tuple(${1})',                          detail: 'tuple(iterable=())',                       documentation: 'Create or convert to tuple.' },
  { label: 'sum',        insertText: 'sum(${1:iterable})',                   detail: 'sum(iterable, start=0)',                   documentation: 'Sum of iterable.' },
  { label: 'min',        insertText: 'min(${1})',                            detail: 'min(iterable, *[, key, default])',         documentation: 'Minimum value.' },
  { label: 'max',        insertText: 'max(${1})',                            detail: 'max(iterable, *[, key, default])',         documentation: 'Maximum value.' },
  { label: 'abs',        insertText: 'abs(${1:x})',                          detail: 'abs(x)',                                   documentation: 'Absolute value.' },
  { label: 'round',      insertText: 'round(${1:number})',                   detail: 'round(number[, ndigits])',                 documentation: 'Round number.' },
  { label: 'isinstance', insertText: 'isinstance(${1:obj}, ${2:type})',     detail: 'isinstance(object, classinfo)',            documentation: 'Check type.' },
  { label: 'type',       insertText: 'type(${1:obj})',                       detail: 'type(object)',                             documentation: 'Return type of object.' },
  { label: 'input',      insertText: 'input(${1:""})',                      detail: 'input(prompt="")',                        documentation: 'Read line from stdin.' },
  { label: 'open',       insertText: 'open(${1:file}, ${2:"r"})',          detail: 'open(file, mode="r")',                    documentation: 'Open file.' },
  { label: 'any',        insertText: 'any(${1:iterable})',                   detail: 'any(iterable)',                            documentation: 'True if any element is truthy.' },
  { label: 'all',        insertText: 'all(${1:iterable})',                   detail: 'all(iterable)',                            documentation: 'True if all elements are truthy.' },
  { label: 'hex',        insertText: 'hex(${1:x})',                          detail: 'hex(x)',                                   documentation: 'Convert int to hex string.' },
  { label: 'bin',        insertText: 'bin(${1:x})',                          detail: 'bin(x)',                                   documentation: 'Convert int to binary string.' },
  { label: 'ord',        insertText: 'ord(${1:c})',                          detail: 'ord(c)',                                   documentation: 'Return Unicode code point.' },
  { label: 'chr',        insertText: 'chr(${1:i})',                          detail: 'chr(i)',                                   documentation: 'Return char from code point.' },
];

// Common stdlib classes that are frequently imported
const PYTHON_STDLIB: PyEntry[] = [
  { label: 'List',        insertText: 'List[${1:T}]',                 detail: 'typing.List' },
  { label: 'Dict',        insertText: 'Dict[${1:K}, ${2:V}]',        detail: 'typing.Dict' },
  { label: 'Optional',    insertText: 'Optional[${1:T}]',             detail: 'typing.Optional' },
  { label: 'Tuple',       insertText: 'Tuple[${1}]',                  detail: 'typing.Tuple' },
  { label: 'Union',       insertText: 'Union[${1:T1}, ${2:T2}]',     detail: 'typing.Union' },
  { label: 'Any',         insertText: 'Any',                          detail: 'typing.Any' },
  { label: 'Callable',    insertText: 'Callable[[${1}], ${2:None}]', detail: 'typing.Callable' },
  { label: 'Set',         insertText: 'Set[${1:T}]',                  detail: 'typing.Set' },
  { label: 'Iterator',    insertText: 'Iterator[${1:T}]',             detail: 'typing.Iterator' },
  { label: 'defaultdict', insertText: 'defaultdict(${1:int})',        detail: 'collections.defaultdict' },
  { label: 'Counter',     insertText: 'Counter(${1})',                detail: 'collections.Counter' },
  { label: 'deque',       insertText: 'deque(${1})',                  detail: 'collections.deque' },
  { label: 'heappush',    insertText: 'heappush(${1:heap}, ${2:item})', detail: 'heapq.heappush' },
  { label: 'heappop',     insertText: 'heappop(${1:heap})',           detail: 'heapq.heappop' },
  { label: 'bisect_left', insertText: 'bisect_left(${1:a}, ${2:x})', detail: 'bisect.bisect_left' },
  { label: 'math',        insertText: 'math.${1:sqrt}(${2})',         detail: 'math module' },
];

const PYTHON_SNIPPETS: PyEntry[] = [
  { label: 'def',      insertText: 'def ${1:name}(${2:args}):\n    ${3:pass}',                                        detail: 'function definition' },
  { label: 'class',    insertText: 'class ${1:Name}:\n    def __init__(self${2:}):\n        ${3:pass}',              detail: 'class definition' },
  { label: 'fori',     insertText: 'for ${1:i} in range(${2:n}):\n    ${3:pass}',                                     detail: 'for range loop' },
  { label: 'for',      insertText: 'for ${1:item} in ${2:iterable}:\n    ${3:pass}',                                  detail: 'for-in loop' },
  { label: 'while',    insertText: 'while ${1:condition}:\n    ${2:pass}',                                            detail: 'while loop' },
  { label: 'ifelse',   insertText: 'if ${1:condition}:\n    ${2:pass}\nelse:\n    ${3:pass}',                       detail: 'if-else statement' },
  { label: 'try',      insertText: 'try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    ${4:pass}',          detail: 'try-except' },
  { label: 'tryfe',    insertText: 'try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:e}:\n    ${4:pass}\nfinally:\n    ${5:pass}', detail: 'try-except-finally' },
  { label: 'with',     insertText: 'with ${1:context} as ${2:ctx}:\n    ${3:pass}',                                  detail: 'with statement' },
  { label: 'lambda',   insertText: 'lambda ${1:x}: ${2:x}',                                                           detail: 'lambda expression' },
  { label: 'listcomp', insertText: '[${1:expr} for ${2:item} in ${3:iterable}]',                                       detail: 'list comprehension' },
  { label: 'dictcomp', insertText: '{${1:k}: ${2:v} for ${3:k}, ${4:v} in ${5:items}.items()}',                      detail: 'dict comprehension' },
  { label: 'fstring',  insertText: 'f"${1:text}{${2:var}}"',                                                         detail: 'f-string' },
  { label: 'main',     insertText: 'if __name__ == "__main__":\n    ${1:main()}',                                    detail: 'main guard' },
];

function registerPythonCompletions(monaco: MonacoInstance): void {
  if (pythonProviderRegistered) return;
  pythonProviderRegistered = true;

  const { CompletionItemKind: CIK, CompletionItemInsertTextRule: CITR } = monaco.languages;

  monaco.languages.registerCompletionItemProvider('python', {
    triggerCharacters: ['.', ' ', '(', ','],
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber:   position.lineNumber,
        startColumn:     word.startColumn,
        endColumn:       word.endColumn,
      };
      const suggestions: Monaco.languages.CompletionItem[] = [
        ...PYTHON_BUILTINS.map((b) => ({
          label:           b.label,
          kind:            CIK.Function,
          detail:          b.detail,
          documentation:   b.documentation ? { value: b.documentation } : undefined,
          insertText:      b.insertText,
          insertTextRules: CITR.InsertAsSnippet,
          range,
        } satisfies Monaco.languages.CompletionItem)),
        ...PYTHON_STDLIB.map((s) => ({
          label:           s.label,
          kind:            CIK.Class,
          detail:          s.detail,
          insertText:      s.insertText,
          insertTextRules: CITR.InsertAsSnippet,
          range,
        } satisfies Monaco.languages.CompletionItem)),
        ...PYTHON_SNIPPETS.map((snip) => ({
          label:           snip.label,
          kind:            CIK.Snippet,
          detail:          snip.detail,
          insertText:      snip.insertText,
          insertTextRules: CITR.InsertAsSnippet,
          range,
        } satisfies Monaco.languages.CompletionItem)),
      ];
      return { suggestions };
    },
  });
}

// ─── C++ / Go / C# snippet completions ───────────────────────────────────────

interface SnipEntry { label: string; insertText: string; detail: string; }

function makeSnippetProvider(monaco: MonacoInstance, language: string, snippets: SnipEntry[]): void {
  const { CompletionItemKind: CIK, CompletionItemInsertTextRule: CITR } = monaco.languages;
  monaco.languages.registerCompletionItemProvider(language, {
    triggerCharacters: [' ', '.', '('],
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber:   position.lineNumber,
        startColumn:     word.startColumn,
        endColumn:       word.endColumn,
      };
      return {
        suggestions: snippets.map((s) => ({
          label:           s.label,
          kind:            CIK.Snippet,
          detail:          s.detail,
          insertText:      s.insertText,
          insertTextRules: CITR.InsertAsSnippet,
          range,
        } satisfies Monaco.languages.CompletionItem)),
      };
    },
  });
}

const CPP_SNIPPETS: SnipEntry[] = [
  { label: 'cout',    insertText: 'cout << ${1} << endl;',                                                    detail: 'cout output' },
  { label: 'cin',     insertText: 'cin >> ${1};',                                                              detail: 'cin input' },
  { label: 'fori',    insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3}\n}',          detail: 'for loop' },
  { label: 'forit',   insertText: 'for (auto& ${1:item} : ${2:container}) {\n\t${3}\n}',                    detail: 'range-for loop' },
  { label: 'while',   insertText: 'while (${1:condition}) {\n\t${2}\n}',                                    detail: 'while loop' },
  { label: 'ifelse',  insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',                   detail: 'if-else' },
  { label: 'trycatch', insertText: 'try {\n\t${1}\n} catch (const ${2:exception}& ${3:e}) {\n\t${4}\n}',   detail: 'try-catch' },
  { label: 'class',   insertText: 'class ${1:Name} {\npublic:\n\t${2}\n};',                               detail: 'class definition' },
  { label: 'struct',  insertText: 'struct ${1:Name} {\n\t${2}\n};',                                        detail: 'struct definition' },
  { label: 'vec',     insertText: 'vector<${1:int}> ${2:v};',                                               detail: 'vector' },
  { label: 'map',     insertText: 'map<${1:K}, ${2:V}> ${3:m};',                                           detail: 'map' },
  { label: 'uset',    insertText: 'unordered_set<${1:T}> ${2:s};',                                         detail: 'unordered_set' },
  { label: 'umap',    insertText: 'unordered_map<${1:K}, ${2:V}> ${3:m};',                                 detail: 'unordered_map' },
  { label: 'pq',      insertText: 'priority_queue<${1:int}> ${2:pq};',                                     detail: 'max-heap priority_queue' },
  { label: 'pqmin',   insertText: 'priority_queue<${1:int}, vector<${1:int}>, greater<${1:int}>> ${2:pq};', detail: 'min-heap priority_queue' },
  { label: 'sort',    insertText: 'sort(${1:v}.begin(), ${1:v}.end());',                                    detail: 'sort' },
  { label: 'sortd',   insertText: 'sort(${1:v}.begin(), ${1:v}.end(), greater<${2:int}>());',              detail: 'sort descending' },
  { label: 'bsearch', insertText: 'lower_bound(${1:v}.begin(), ${1:v}.end(), ${2:target})',                detail: 'lower_bound binary search' },
  { label: 'lambda',  insertText: '[${1:&}](${2}) { return ${3}; }',                                        detail: 'lambda expression' },
  { label: 'pair',    insertText: 'pair<${1:T1}, ${2:T2}> ${3:p} = {${4}, ${5}};',                       detail: 'pair declaration' },
  { label: 'auto',    insertText: 'auto ${1:name} = ${2:value};',                                           detail: 'auto type deduction' },
];

const GO_SNIPPETS: SnipEntry[] = [
  { label: 'fmt',       insertText: 'fmt.Println(${1})',                                                      detail: 'fmt.Println' },
  { label: 'fmtf',      insertText: 'fmt.Printf("${1:%v}\\n", ${2})',                                      detail: 'fmt.Printf' },
  { label: 'func',      insertText: 'func ${1:name}(${2:args}) ${3:returnType} {\n\t${4}\n}',              detail: 'function declaration' },
  { label: 'fori',      insertText: 'for ${1:i} := 0; ${1:i} < ${2:n}; ${1:i}++ {\n\t${3}\n}',           detail: 'for loop' },
  { label: 'forr',      insertText: 'for ${1:i}, ${2:v} := range ${3:slice} {\n\t${4}\n}',               detail: 'range loop' },
  { label: 'while',     insertText: 'for ${1:condition} {\n\t${2}\n}',                                    detail: 'while-like loop' },
  { label: 'ifelse',    insertText: 'if ${1:condition} {\n\t${2}\n} else {\n\t${3}\n}',                  detail: 'if-else' },
  { label: 'iferr',     insertText: 'if err != nil {\n\treturn ${1:err}\n}',                              detail: 'error check' },
  { label: 'struct',    insertText: 'type ${1:Name} struct {\n\t${2:Field} ${3:type}\n}',                detail: 'struct type' },
  { label: 'iface',     insertText: 'type ${1:Name} interface {\n\t${2:Method}(${3}) ${4}\n}',           detail: 'interface type' },
  { label: 'slice',     insertText: '${1:name} := make([]${2:int}, ${3:0})',                               detail: 'slice with make' },
  { label: 'mapd',      insertText: '${1:name} := make(map[${2:K}]${3:V})',                               detail: 'map with make' },
  { label: 'goroutine', insertText: 'go func() {\n\t${1}\n}()',                                          detail: 'anonymous goroutine' },
  { label: 'defer',     insertText: 'defer ${1:func()}',                                                    detail: 'defer statement' },
  { label: 'short',     insertText: '${1:name} := ${2:value}',                                             detail: 'short variable declaration' },
  { label: 'switch',    insertText: 'switch ${1:expr} {\ncase ${2:value}:\n\t${3}\ndefault:\n\t${4}\n}', detail: 'switch statement' },
];

const CSHARP_SNIPPETS: SnipEntry[] = [
  { label: 'writeln',  insertText: 'Console.WriteLine(${1});',                                                                              detail: 'Console.WriteLine' },
  { label: 'write',    insertText: 'Console.Write(${1});',                                                                                  detail: 'Console.Write' },
  { label: 'var',      insertText: 'var ${1:name} = ${2:value};',                                                                          detail: 'var declaration' },
  { label: 'fori',     insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${3}\n}',                                      detail: 'for loop' },
  { label: 'foreach',  insertText: 'foreach (var ${1:item} in ${2:collection}) {\n\t${3}\n}',                                           detail: 'foreach loop' },
  { label: 'while',    insertText: 'while (${1:condition}) {\n\t${2}\n}',                                                               detail: 'while loop' },
  { label: 'ifelse',   insertText: 'if (${1:condition}) {\n\t${2}\n} else {\n\t${3}\n}',                                              detail: 'if-else' },
  { label: 'trycatch', insertText: 'try {\n\t${1}\n} catch (${2:Exception} ${3:e}) {\n\t${4:Console.WriteLine(e.Message);}\n}',        detail: 'try-catch' },
  { label: 'class',    insertText: 'public class ${1:Name} {\n\t${2}\n}',                                                              detail: 'class definition' },
  { label: 'prop',     insertText: 'public ${1:int} ${2:Name} { get; set; }',                                                             detail: 'auto property' },
  { label: 'lambda',   insertText: '(${1:x}) => ${2:x}',                                                                                   detail: 'lambda expression' },
  { label: 'linq',     insertText: '${1:collection}.Where(${2:x} => ${3:true}).Select(${4:x} => ${5:x}).ToList()',                       detail: 'LINQ chain' },
  { label: 'list',     insertText: 'List<${1:T}> ${2:list} = new List<${1:T}>();',                                                       detail: 'List<T>' },
  { label: 'dict',     insertText: 'Dictionary<${1:K}, ${2:V}> ${3:dict} = new Dictionary<${1:K}, ${2:V}>();',                          detail: 'Dictionary<K,V>' },
  { label: 'switch',   insertText: 'switch (${1:expr}) {\n\tcase ${2:value}:\n\t\t${3}\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}', detail: 'switch statement' },
];

function registerCppCompletions(monaco: MonacoInstance): void {
  if (cppProviderRegistered) return;
  cppProviderRegistered = true;
  makeSnippetProvider(monaco, 'cpp', CPP_SNIPPETS);
}

function registerGoCompletions(monaco: MonacoInstance): void {
  if (goProviderRegistered) return;
  goProviderRegistered = true;
  makeSnippetProvider(monaco, 'go', GO_SNIPPETS);
}

function registerCSharpCompletions(monaco: MonacoInstance): void {
  if (csharpProviderRegistered) return;
  csharpProviderRegistered = true;
  makeSnippetProvider(monaco, 'csharp', CSHARP_SNIPPETS);
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Call this from the Monaco Editor `beforeMount` prop.
 * Safe to call multiple times — registration is guarded by module-level flags.
 */
export function setupMonaco(monaco: MonacoInstance): void {
  registerJavaCompletions(monaco);
  configureTypeScriptJavaScript(monaco);
  registerPythonCompletions(monaco);
  registerCppCompletions(monaco);
  registerGoCompletions(monaco);
  registerCSharpCompletions(monaco);
}

/**
 * Enhanced editor options to pass to the Monaco `options` prop.
 * Spread these over your base options.
 */
export const ENHANCED_EDITOR_OPTIONS: Monaco.editor.IStandaloneEditorConstructionOptions = {
  quickSuggestions:                  { other: true, comments: false, strings: true },
  parameterHints:                    { enabled: true, cycle: true },
  inlayHints:                        { enabled: 'on' },
  tabCompletion:                     'on',
  wordBasedSuggestions:              'currentDocument',
  snippetSuggestions:                'top',
  acceptSuggestionOnCommitCharacter: true,
  hover:                             { enabled: true, delay: 300 },
  fixedOverflowWidgets:              true,
  suggest: {
    preview:         true,
    previewMode:     'subwordSmart',
    showSnippets:    true,
    showClasses:     true,
    showInterfaces:  true,
    showMethods:     true,
    showKeywords:    true,
    showWords:       true,
    showFunctions:   true,
    showVariables:   true,
    showConstants:   true,
    showModules:     true,
    showProperties:  true,
    filterGraceful:  true,
    localityBonus:   true,
    insertMode:      'replace',
  },
};

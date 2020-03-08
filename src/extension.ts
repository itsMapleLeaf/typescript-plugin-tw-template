// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode"

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const completionProvider: vscode.CompletionItemProvider = {
    provideCompletionItems(document, position, token, context) {
      const linePrefix = document
        .lineAt(position)
        .text.slice(0, position.character)

      if (/tw\s*`/.test(linePrefix)) {
        return [
          new vscode.CompletionItem(
            "class1",
            vscode.CompletionItemKind.Constant,
          ),
          new vscode.CompletionItem(
            "class2",
            vscode.CompletionItemKind.Constant,
          ),
          new vscode.CompletionItem(
            "class3",
            vscode.CompletionItemKind.Constant,
          ),
        ]
      }
    },
  }

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "javascript",
      completionProvider,
      "`",
      " ",
    ),
    vscode.languages.registerCompletionItemProvider(
      "javascriptreact",
      completionProvider,
      "`",
      " ",
    ),
    vscode.languages.registerCompletionItemProvider(
      "typescript",
      completionProvider,
      "`",
      " ",
    ),
    vscode.languages.registerCompletionItemProvider(
      "typescriptreact",
      completionProvider,
      "`",
      " ",
    ),
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}

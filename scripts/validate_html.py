from html.parser import HTMLParser
from pathlib import Path

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.errors = []
        self.void = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}

    def handle_starttag(self, tag, attrs):
        if tag not in self.void:
            self.stack.append(tag)

    def handle_startendtag(self, tag, attrs):
        pass

    def handle_endtag(self, tag):
        if tag in self.void:
            return
        if not self.stack:
            self.errors.append(f'unexpected closing tag </{tag}>')
            return
        if self.stack[-1] != tag:
            self.errors.append(f'expected </{self.stack[-1]}> but found </{tag}>')
            return
        self.stack.pop()

for filename in ['index.html', 'docs/speech-synthesis.html']:
    parser = Parser()
    parser.feed(Path(filename).read_text(encoding='utf-8'))
    parser.close()
    if parser.stack:
        parser.errors.append('unclosed tags: ' + ', '.join(parser.stack))
    if parser.errors:
        raise SystemExit(f'{filename}: ' + '; '.join(parser.errors))
    print(f'{filename}: basic HTML structure passed.')

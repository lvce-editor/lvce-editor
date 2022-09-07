import * as DirentType from '../DirentType/DirentType.js'

// TODO when it rejects, it should throw a custom error,
// FileSystemError

export const name = 'Web'

const files = Object.create(null)

files['/.gitkeep'] = ''

files['/languages/index.dart'] = `void main() {
  print('Hello, World!');
}`

files['/languages/index.js'] = `const add = (a, b) => {
  return a + b;
}`

files['/languages/scrolling.txt'] = `line 1
line 2
line 3
line 4
line 5
line 6
line 7
line 8
line 9
line 10
line 11
line 12
line 13
line 14
line 15
line 16
line 17
line 18
line 19
line 20
line 21
line 22
line 23
line 24
line 25
line 26
line 27
line 28
line 29
line 30
line 31
line 32
line 33
line 34
line 35
line 36
line 37
line 38
line 39
line 40
line 41
line 42
line 43
line 44
line 45
line 46
line 47
line 48
line 49
line 50
line 51
line 52
line 53
line 54
line 55
line 56
line 57
line 58
line 59
line 60
line 61
line 62
line 63
line 64
line 65
line 66
line 67
line 68
line 69
line 70
line 71
line 72
line 73
line 74
line 75
line 76
line 77
line 78
line 79
line 80
line 81
line 82
line 83
line 84
line 85
line 86
line 87
line 88
line 89
line 90
line 91
line 92
line 93
line 94
line 95
line 96
line 97
line 98
line 99
line 100
`

files['/languages/index.html'] = '<h1 class="abc">hello world</h1>'

files['/languages/index.css'] = `h1 {
  font-size: 24px;
}

.Editor {
  width: 100%;
  height: 100%;
  background: var(--MainBackground);
  color: white;
  outline: none;
  border: none;
  font-family: 'Fira Code', monospace;
  position: relative;
  white-space: pre;
  font-size: 15px;
  letter-spacing: 0.5px;
  contain: strict;
  tab-size: 2;
}
`

files['/languages/index.ex'] = `defmodule RealWorld do
  @moduledoc """
  RealWorld keeps the contexts that define your domain
  and business logic.
  Contexts are also responsible for managing your data, regardless
  if it comes from the database, an external API or others.
  """
end`

files['/languages/index.jl'] = `function mandelbrot(a)
z = 0
for i=1:50
z = z^2 + a
end
return z
end

for y=1.0:-0.05:-1.0
for x=-2.0:0.0315:0.5
abs(mandelbrot(complex(x, y))) < 2 ? print("*") : print(" ")
end
println()
end`

files['/languages/index.perl'] = `#!/usr/bin/perl
#
# The traditional first program.

# Strict and warnings are recommended.
use strict;
use warnings;

# Print a message.
print "Hello, World!\n";`

files['/languages/index.kt'] = `fun main(args : Array<String>) {
  println("Hello, World!")
}`

files['/languages/index.java'] = `class HelloWorld {
  public static void main(String[] args) {
      System.out.println("Hello, World!");
  }
}`

files['/languages/index.cpp'] = `using namespace std;

template <class ANYTYPE>
void thing(int a, Blah other_thing, double c=10, ANYTYPE f) {
    return;
}

int operator^(double a, double b) {
    cout << "testing";
    return 0;
}

int main(char arg_num, char** vargs) {
    if (     1 and 0       ) cout << "this is the and operator\n";
    if (  true and (c > 1) ) cout << "this is the and operator\n";
    if ((true) and (c > 1) ) cout << "this is still the and operator\n";

    #error I should be able to write single quotes in here: Don't make errors
}`

files['/languages/index.env'] = 'KEY=42'

files['/sample-folder/a.txt'] = ''
files['/sample-folder/b.txt'] = ''
files['/sample-folder/c.txt'] = ''

export const state = {
  watchers: Object.create(null),
  saveListeners: [],
}

const getName = (path) => {
  return path.slice(path.lastIndexOf('/') + 1)
}

const getRelativePath = (path) => {
  return path.slice('/workspace'.length)
}

export const readFile = async (path) => {
  const relativePath = getRelativePath(path)
  const file = files[relativePath]
  if (file === undefined) {
    throw new Error('file not found')
  }
  return file
}

export const remove = async (path) => {
  throw new Error('not implemented')
}

export const rename = async (oldPath, newPath) => {
  throw new Error('not implemented')
}

export const mkdir = async (path) => {
  throw new Error('not implemented')
}

export const createFile = async (path) => {
  throw new Error('not implemented')
}

export const createFolder = async (path) => {
  throw new Error('not implemented')
}

export const writeFile = async (path, content) => {
  throw new Error('not implemented')
}

const getDirent = (path, relativePath) => {
  const rest = path.slice(relativePath.length + 1)
  if (rest.includes('/')) {
    return {
      type: DirentType.Directory,
      name: rest.slice(0, rest.indexOf('/')),
    }
  }
  return {
    type: 'file',
    name: rest,
  }
}

export const readDirWithFileTypes = (path) => {
  const relativePath = getRelativePath(path)
  const dirents = []
  for (const key in files) {
    if (key.startsWith(relativePath)) {
      const dirent = getDirent(key, relativePath)
      if (!dirents.some((otherDirent) => otherDirent.name === dirent.name)) {
        dirents.push(dirent)
      }
    }
  }
  return dirents
}

export const watch = async (path) => {
  throw new Error('not implemented')
}

export const unwatch = (id) => {
  throw new Error('not implemented')
}

export const unwatchAll = () => {
  throw new Error('not implemented')
}

// TODO should be in main/textDocument
export const onDidSave = (listener) => {
  throw new Error('not implemented')
}

export const getPathSeparator = () => {
  return '/'
}

export type FileNode = {
  type: "file";
  name: string;
  content: string;
};

export type DirectoryNode = {
  type: "directory";
  name: string;
  children: FileSystemNode[];
};

export type FileSystemNode =
  | FileNode
  | DirectoryNode;

export function createInitialFileSystem(): DirectoryNode {
  return {
    type: "directory",
    name: "~",
    children: [
      {
        type: "directory",
        name: "Documents",
        children: [
          {
            type: "directory",
            name: "Tugas",
            children: [],
          },
          {
            type: "directory",
            name: "Materi",
            children: [],
          },
        ],
      },
      {
        type: "directory",
        name: "Downloads",
        children: [],
      },
      {
        type: "directory",
        name: "CLOEV",
        children: [
          {
            type: "directory",
            name: "Assignments",
            children: [],
          },
          {
            type: "directory",
            name: "Notes",
            children: [],
          },
        ],
      },
    ],
  };
}

export function cloneFileSystem(
  filesystem: DirectoryNode,
): DirectoryNode {
  return structuredClone(filesystem);
}

export function normalizePath(
  path: string,
  currentPath: string[],
): string[] {
  if (!path || path === ".") {
    return [...currentPath];
  }

  const parts = path.startsWith("/")
    ? path.split("/")
    : [...currentPath, ...path.split("/")];

  const result: string[] = [];

  for (const part of parts) {
    if (!part || part === ".") {
      continue;
    }

    if (part === "..") {
      result.pop();
      continue;
    }

    result.push(part);
  }

  return result;
}

export function findDirectory(
  root: DirectoryNode,
  path: string[],
): DirectoryNode | null {
  let current = root;

  for (const segment of path) {
    const child: FileSystemNode | undefined =
      current.children.find(
        (item: FileSystemNode) =>
          item.type === "directory" &&
          item.name === segment,
      );

    if (!child || child.type !== "directory") {
      return null;
    }

    current = child;
  }

  return current;
}

export function findNode(
  root: DirectoryNode,
  path: string[],
): FileSystemNode | null {
  if (path.length === 0) {
    return root;
  }

  let current: FileSystemNode = root;

  for (const segment of path) {
    if (current.type !== "directory") {
      return null;
    }

    const child: FileSystemNode | undefined =
      current.children.find(
        (item: FileSystemNode) =>
          item.name === segment,
      );

    if (!child) {
      return null;
    }

    current = child;
  }

  return current;
}

export function directoryExists(
  root: DirectoryNode,
  path: string[],
): boolean {
  return findDirectory(root, path) !== null;
}

export function nodeExists(
  root: DirectoryNode,
  path: string[],
): boolean {
  return findNode(root, path) !== null;
}
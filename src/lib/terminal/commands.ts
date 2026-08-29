import {
  DirectoryNode,
  cloneFileSystem,
  directoryExists,
  findDirectory,
  findNode,
  normalizePath,
  nodeExists,
} from "./filesystem";

export type CommandContext = {
  filesystem: DirectoryNode;
  currentPath: string[];
  username: string;
  fullName: string;
  history: string[];
};

export type CommandResult = {
  output: string[];
  filesystem?: DirectoryNode;
  currentPath?: string[];
  clear?: boolean;
};

type CommandHandler = (
  args: string[],
  context: CommandContext,
) => CommandResult;

function formatPath(path: string[]): string {
  if (path.length === 0) {
    return "~";
  }

  return `~/${path.join("/")}`;
}

function getParentPath(
  path: string[],
): string[] {
  return path.slice(0, -1);
}

function getBaseName(
  path: string[],
): string {
  return path[path.length - 1] ?? "";
}

/* ==================================================
   HELP
================================================== */

const help: CommandHandler = () => ({
  output: [
    "CLOEV Terminal - available commands",
    "",
    "Filesystem:",
    "  ls                  List files and folders",
    "  cd <directory>      Change directory",
    "  pwd                 Show current directory",
    "  mkdir <name>        Create a directory",
    "  rmdir <name>        Remove an empty directory",
    "  touch <name>        Create an empty file",
    "  cat <file>           Show file contents",
    "  rm <file>            Remove a file",
    "  cp <source> <dest>   Copy a file or directory",
    "  mv <source> <dest>   Move or rename a file",
    "  tree                Show virtual filesystem tree",
    "  find [directory]     Find files and folders",
    "",
    "Text:",
    "  echo <text>          Print text",
    "  head <file>         Show first lines of a file",
    "  tail <file>         Show last lines of a file",
    "  grep <text> <file>  Search text in a file",
    "  wc <file>           Count lines, words and characters",
    "",
    "System:",
    "  date                Show current date",
    "  uname               Show simulated system name",
    "  uname -a            Show simulated system information",
    "",
    "CLOEV:",
    "  whoami              Show current user",
    "  account             Show account information",
    "  schedule            Show class schedule",
    "  tasks               Show assignments",
    "  members             Show class members",
    "  picket              Show today's picket",
    "  academic            Show academic information",
    "  weather             Show weather information",
    "",
    "Terminal:",
    "  clear               Clear terminal",
    "  history             Show command history",
    "  help                Show this help",
    "  version             Show terminal version",
    "",
    "This terminal is a simulation.",
  ],
});

/* ==================================================
   CLEAR
================================================== */

const clear: CommandHandler = () => ({
  output: [],
  clear: true,
});

/* ==================================================
   PWD
================================================== */

const pwd: CommandHandler = (_, context) => ({
  output: [formatPath(context.currentPath)],
});

/* ==================================================
   WHOAMI
================================================== */

const whoami: CommandHandler = (_, context) => ({
  output: [context.username],
});

/* ==================================================
   VERSION
================================================== */

const version: CommandHandler = () => ({
  output: [
    "CLOEV Terminal v1.1",
    "CLOEV Linux Simulator",
    "Simulation Mode",
    "Virtual Filesystem",
  ],
});

/* ==================================================
   LS
================================================== */

const ls: CommandHandler = (_, context) => {
  const directory = findDirectory(
    context.filesystem,
    context.currentPath,
  );

  if (!directory) {
    return {
      output: ["ls: directory not found"],
    };
  }

  const items = [...directory.children].sort(
    (a, b) => {
      if (a.type !== b.type) {
        return a.type === "directory" ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    },
  );

  if (items.length === 0) {
    return {
      output: [],
    };
  }

  return {
    output: items.map((item) =>
      item.type === "directory"
        ? `${item.name}/`
        : item.name,
    ),
  };
};

/* ==================================================
   CD
================================================== */

const cd: CommandHandler = (
  args,
  context,
) => {
  const target = args[0] ?? "~";

  const nextPath = normalizePath(
    target,
    context.currentPath,
  );

  if (
    !directoryExists(
      context.filesystem,
      nextPath,
    )
  ) {
    return {
      output: [
        `cd: ${target}: No such directory`,
      ],
    };
  }

  return {
    output: [],
    currentPath: nextPath,
  };
};

/* ==================================================
   MKDIR
================================================== */

const mkdir: CommandHandler = (
  args,
  context,
) => {
  const name = args[0];

  if (!name) {
    return {
      output: ["mkdir: missing operand"],
    };
  }

  const targetPath = normalizePath(
    name,
    context.currentPath,
  );

  if (
    nodeExists(
      context.filesystem,
      targetPath,
    )
  ) {
    return {
      output: [
        `mkdir: cannot create directory '${name}': File exists`,
      ],
    };
  }

  const parent = findDirectory(
    context.filesystem,
    getParentPath(targetPath),
  );

  if (!parent) {
    return {
      output: [
        `mkdir: cannot create directory '${name}': No such directory`,
      ],
    };
  }

  const filesystem =
    cloneFileSystem(context.filesystem);

  const targetParent = findDirectory(
    filesystem,
    getParentPath(targetPath),
  );

  if (!targetParent) {
    return {
      output: [
        `mkdir: cannot create directory '${name}'`,
      ],
    };
  }

  targetParent.children.push({
    type: "directory",
    name: getBaseName(targetPath),
    children: [],
  });

  return {
    output: [],
    filesystem,
  };
};

/* ==================================================
   TOUCH
================================================== */

const touch: CommandHandler = (
  args,
  context,
) => {
  const name = args[0];

  if (!name) {
    return {
      output: ["touch: missing file operand"],
    };
  }

  const targetPath = normalizePath(
    name,
    context.currentPath,
  );

  if (
    nodeExists(
      context.filesystem,
      targetPath,
    )
  ) {
    return {
      output: [],
    };
  }

  const filesystem =
    cloneFileSystem(context.filesystem);

  const parent = findDirectory(
    filesystem,
    getParentPath(targetPath),
  );

  if (!parent) {
    return {
      output: [
        `touch: cannot touch '${name}': No such directory`,
      ],
    };
  }

  parent.children.push({
    type: "file",
    name: getBaseName(targetPath),
    content: "",
  });

  return {
    output: [],
    filesystem,
  };
};

/* ==================================================
   CAT
================================================== */

const cat: CommandHandler = (
  args,
  context,
) => {
  const name = args[0];

  if (!name) {
    return {
      output: ["cat: missing file operand"],
    };
  }

  const path = normalizePath(
    name,
    context.currentPath,
  );

  const node = findNode(
    context.filesystem,
    path,
  );

  if (!node) {
    return {
      output: [
        `cat: ${name}: No such file or directory`,
      ],
    };
  }

  if (node.type === "directory") {
    return {
      output: [
        `cat: ${name}: Is a directory`,
      ],
    };
  }

  return {
    output: node.content
      ? node.content.split("\n")
      : [],
  };
};

/* ==================================================
   RM
================================================== */

const rm: CommandHandler = (
  args,
  context,
) => {
  const name = args[0];

  if (!name) {
    return {
      output: ["rm: missing operand"],
    };
  }

  const path = normalizePath(
    name,
    context.currentPath,
  );

  const node = findNode(
    context.filesystem,
    path,
  );

  if (!node) {
    return {
      output: [
        `rm: cannot remove '${name}': No such file or directory`,
      ],
    };
  }

  if (node.type === "directory") {
    return {
      output: [
        `rm: cannot remove '${name}': Is a directory`,
      ],
    };
  }

  const filesystem =
    cloneFileSystem(context.filesystem);

  const parent = findDirectory(
    filesystem,
    getParentPath(path),
  );

  if (!parent) {
    return {
      output: [
        `rm: cannot remove '${name}'`,
      ],
    };
  }

  parent.children =
    parent.children.filter(
      (item) =>
        item.name !== getBaseName(path),
    );

  return {
    output: [],
    filesystem,
  };
};

/* ==================================================
   RMDIR
================================================== */

const rmdir: CommandHandler = (
  args,
  context,
) => {
  const name = args[0];

  if (!name) {
    return {
      output: ["rmdir: missing operand"],
    };
  }

  const path = normalizePath(
    name,
    context.currentPath,
  );

  const node = findNode(
    context.filesystem,
    path,
  );

  if (!node) {
    return {
      output: [
        `rmdir: failed to remove '${name}': No such directory`,
      ],
    };
  }

  if (node.type !== "directory") {
    return {
      output: [
        `rmdir: failed to remove '${name}': Not a directory`,
      ],
    };
  }

  if (node.children.length > 0) {
    return {
      output: [
        `rmdir: failed to remove '${name}': Directory not empty`,
      ],
    };
  }

  const filesystem =
    cloneFileSystem(context.filesystem);

  const parent = findDirectory(
    filesystem,
    getParentPath(path),
  );

  if (!parent) {
    return {
      output: [
        `rmdir: failed to remove '${name}'`,
      ],
    };
  }

  parent.children =
    parent.children.filter(
      (item) =>
        item.name !== getBaseName(path),
    );

  return {
    output: [],
    filesystem,
  };
};

/* ==================================================
   ECHO
================================================== */

const echo: CommandHandler = (
  args,
  context,
) => {
  if (args.length === 0) {
    return {
      output: [""],
    };
  }

  const redirectIndex = args.findIndex(
    (arg) =>
      arg === ">" ||
      arg === ">>",
  );

  if (redirectIndex === -1) {
    return {
      output: [args.join(" ")],
    };
  }

  const operator = args[redirectIndex];
  const fileName =
    args[redirectIndex + 1];

  if (!fileName) {
    return {
      output: [
        `bash: syntax error near unexpected token '${operator}'`,
      ],
    };
  }

  const text = args
    .slice(0, redirectIndex)
    .join(" ");

  const path = normalizePath(
    fileName,
    context.currentPath,
  );

  const filesystem =
    cloneFileSystem(context.filesystem);

  const existing = findNode(
    filesystem,
    path,
  );

  if (existing) {
    if (existing.type === "directory") {
      return {
        output: [
          `bash: ${fileName}: Is a directory`,
        ],
      };
    }

    existing.content =
      operator === ">>"
        ? existing.content
          ? `${existing.content}\n${text}`
          : text
        : text;

    return {
      output: [],
      filesystem,
    };
  }

  const parent = findDirectory(
    filesystem,
    getParentPath(path),
  );

  if (!parent) {
    return {
      output: [
        `bash: ${fileName}: No such directory`,
      ],
    };
  }

  parent.children.push({
    type: "file",
    name: getBaseName(path),
    content: text,
  });

  return {
    output: [],
    filesystem,
  };
};

/* ==================================================
   HEAD
================================================== */

const head: CommandHandler = (
  args,
  context,
) => {
  const name = args[0];

  if (!name) {
    return {
      output: ["head: missing file operand"],
    };
  }

  const path = normalizePath(
    name,
    context.currentPath,
  );

  const node = findNode(
    context.filesystem,
    path,
  );

  if (!node) {
    return {
      output: [
        `head: cannot open '${name}': No such file or directory`,
      ],
    };
  }

  if (node.type === "directory") {
    return {
      output: [
        `head: error reading '${name}': Is a directory`,
      ],
    };
  }

  const lines = node.content.split("\n");

  return {
    output: lines.slice(0, 10),
  };
};

/* ==================================================
   TAIL
================================================== */

const tail: CommandHandler = (
  args,
  context,
) => {
  const name = args[0];

  if (!name) {
    return {
      output: ["tail: missing file operand"],
    };
  }

  const path = normalizePath(
    name,
    context.currentPath,
  );

  const node = findNode(
    context.filesystem,
    path,
  );

  if (!node) {
    return {
      output: [
        `tail: cannot open '${name}': No such file or directory`,
      ],
    };
  }

  if (node.type === "directory") {
    return {
      output: [
        `tail: error reading '${name}': Is a directory`,
      ],
    };
  }

  const lines = node.content.split("\n");

  return {
    output: lines.slice(-10),
  };
};

/* ==================================================
   COPY NODE
================================================== */

function cloneNode(
  node: DirectoryNode["children"][number],
): DirectoryNode["children"][number] {
  if (node.type === "file") {
    return {
      type: "file",
      name: node.name,
      content: node.content,
    };
  }

  return {
    type: "directory",
    name: node.name,
    children: node.children.map(
      (child) => cloneNode(child),
    ),
  };
}

/* ==================================================
   CP
================================================== */

const cp: CommandHandler = (
  args,
  context,
) => {
  if (args.length < 2) {
    return {
      output: [
        "cp: missing destination file operand",
      ],
    };
  }

  const sourceName = args[0];
  const destinationName = args[1];

  const sourcePath = normalizePath(
    sourceName,
    context.currentPath,
  );

  const destinationPath = normalizePath(
    destinationName,
    context.currentPath,
  );

  const source = findNode(
    context.filesystem,
    sourcePath,
  );

  if (!source) {
    return {
      output: [
        `cp: cannot stat '${sourceName}': No such file or directory`,
      ],
    };
  }

  const filesystem =
    cloneFileSystem(context.filesystem);

  const destination =
    findNode(
      filesystem,
      destinationPath,
    );

  if (
    destination &&
    destination.type === "directory"
  ) {
    const copied = cloneNode(source);

    copied.name = source.name;

    destination.children.push(copied);

    return {
      output: [],
      filesystem,
    };
  }

  if (destination) {
    return {
      output: [
        `cp: cannot overwrite '${destinationName}'`,
      ],
    };
  }

  const parent = findDirectory(
    filesystem,
    getParentPath(destinationPath),
  );

  if (!parent) {
    return {
      output: [
        `cp: cannot create '${destinationName}': No such directory`,
      ],
    };
  }

  const copied = cloneNode(source);

  copied.name =
    getBaseName(destinationPath);

  parent.children.push(copied);

  return {
    output: [],
    filesystem,
  };
};

/* ==================================================
   MV
================================================== */

const mv: CommandHandler = (
  args,
  context,
) => {
  if (args.length < 2) {
    return {
      output: [
        "mv: missing destination file operand",
      ],
    };
  }

  const sourceName = args[0];
  const destinationName = args[1];

  const sourcePath = normalizePath(
    sourceName,
    context.currentPath,
  );

  const destinationPath = normalizePath(
    destinationName,
    context.currentPath,
  );

  const source = findNode(
    context.filesystem,
    sourcePath,
  );

  if (!source) {
    return {
      output: [
        `mv: cannot stat '${sourceName}': No such file or directory`,
      ],
    };
  }

  const filesystem =
    cloneFileSystem(context.filesystem);

  const sourceParent =
    findDirectory(
      filesystem,
      getParentPath(sourcePath),
    );

  if (!sourceParent) {
    return {
      output: [
        `mv: cannot move '${sourceName}'`,
      ],
    };
  }

  const sourceIndex =
    sourceParent.children.findIndex(
      (item) =>
        item.name ===
        getBaseName(sourcePath),
    );

  if (sourceIndex === -1) {
    return {
      output: [
        `mv: cannot move '${sourceName}'`,
      ],
    };
  }

  const moving =
    sourceParent.children[sourceIndex];

  const destination =
    findNode(
      filesystem,
      destinationPath,
    );

  if (
    destination &&
    destination.type === "directory"
  ) {
    moving.name = moving.name;

    sourceParent.children.splice(
      sourceIndex,
      1,
    );

    destination.children.push(moving);

    return {
      output: [],
      filesystem,
    };
  }

  if (destination) {
    return {
      output: [
        `mv: cannot overwrite '${destinationName}'`,
      ],
    };
  }

  const destinationParent =
    findDirectory(
      filesystem,
      getParentPath(destinationPath),
    );

  if (!destinationParent) {
    return {
      output: [
        `mv: cannot move '${sourceName}' to '${destinationName}': No such directory`,
      ],
    };
  }

  sourceParent.children.splice(
    sourceIndex,
    1,
  );

  moving.name =
    getBaseName(destinationPath);

  destinationParent.children.push(
    moving,
  );

  return {
    output: [],
    filesystem,
  };
};

/* ==================================================
   FIND
================================================== */

function findTree(
  node: DirectoryNode,
  current: string,
): string[] {
  const result: string[] = [];

  for (const child of node.children) {
    const childPath =
      current === "."
        ? `./${child.name}`
        : `${current}/${child.name}`;

    result.push(childPath);

    if (child.type === "directory") {
      result.push(
        ...findTree(
          child,
          childPath,
        ),
      );
    }
  }

  return result;
}

const find: CommandHandler = (
  args,
  context,
) => {
  const target = args[0] ?? ".";

  const path = normalizePath(
    target,
    context.currentPath,
  );

  const node = findNode(
    context.filesystem,
    path,
  );

  if (!node) {
    return {
      output: [
        `find: '${target}': No such file or directory`,
      ],
    };
  }

  if (node.type === "file") {
    return {
      output: [target],
    };
  }

  return {
    output: [
      ".",
      ...findTree(node, "."),
    ],
  };
};

/* ==================================================
   GREP
================================================== */

const grep: CommandHandler = (
  args,
  context,
) => {
  if (args.length < 2) {
    return {
      output: [
        "grep: usage: grep <text> <file>",
      ],
    };
  }

  const searchText = args[0];
  const name = args[1];

  const path = normalizePath(
    name,
    context.currentPath,
  );

  const node = findNode(
    context.filesystem,
    path,
  );

  if (!node) {
    return {
      output: [
        `grep: ${name}: No such file or directory`,
      ],
    };
  }

  if (node.type === "directory") {
    return {
      output: [
        `grep: ${name}: Is a directory`,
      ],
    };
  }

  const matches =
    node.content
      .split("\n")
      .filter((line) =>
        line.includes(searchText),
      );

  return {
    output: matches,
  };
};
/* ==================================================
   WC
================================================== */

const wc: CommandHandler = (
  args,
  context,
) => {
  const name = args[0];

  if (!name) {
    return {
      output: ["wc: missing file operand"],
    };
  }

  const path = normalizePath(
    name,
    context.currentPath,
  );

  const node = findNode(
    context.filesystem,
    path,
  );

  if (!node) {
    return {
      output: [
        `wc: ${name}: No such file or directory`,
      ],
    };
  }

  if (node.type === "directory") {
    return {
      output: [
        `wc: ${name}: Is a directory`,
      ],
    };
  }

  const content = node.content;

  const lines =
    content === ""
      ? 0
      : content.split("\n").length;

  const words =
    content.trim() === ""
      ? 0
      : content.trim().split(/\s+/).length;

  const characters =
    content.length;

  return {
    output: [
      `${lines} ${words} ${characters} ${name}`,
    ],
  };
};

/* ==================================================
   DATE
================================================== */

const date: CommandHandler = () => ({
  output: [
    new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      },
    ).format(new Date()),
  ],
});

/* ==================================================
   UNAME
================================================== */

const uname: CommandHandler = (
  args,
) => {
  if (args[0] === "-a") {
    return {
      output: [
        "CLOEV-Linux cloev 1.1 virtual x86_64 GNU/Linux",
      ],
    };
  }

  return {
    output: ["CLOEV-Linux"],
  };
};

/* ==================================================
   HISTORY
================================================== */

const history: CommandHandler = (
  _,
  context,
) => ({
  output: context.history.map(
    (command, index) =>
      `${String(index + 1).padStart(4, " ")}  ${command}`,
  ),
});

/* ==================================================
   TREE
================================================== */

function buildTree(
  node: DirectoryNode,
  prefix = "",
): string[] {
  const lines: string[] = [];

  const children = [...node.children].sort(
    (a, b) =>
      a.name.localeCompare(b.name),
  );

  children.forEach(
    (
      child: DirectoryNode["children"][number],
      index,
    ) => {
      const last =
        index === children.length - 1;

      const branch = last
        ? "└── "
        : "├── ";

      lines.push(
        `${prefix}${branch}${child.name}${
          child.type === "directory"
            ? "/"
            : ""
        }`,
      );

      if (child.type === "directory") {
        lines.push(
          ...buildTree(
            child,
            `${prefix}${last ? "    " : "│   "}`,
          ),
        );
      }
    },
  );

  return lines;
}

const tree: CommandHandler = (
  _,
  context,
) => ({
  output: [
    "~",
    ...buildTree(context.filesystem),
  ],
});

/* ==================================================
   ACCOUNT
================================================== */

const account: CommandHandler = (
  _,
  context,
) => ({
  output: [
    "CLOEV Account",
    "────────────────────────",
    `Name  : ${context.fullName}`,
    `User  : ${context.username}`,
    "Role  : Student",
    "Class : XI TKJ 2",
  ],
});

/* ==================================================
   ACADEMIC
================================================== */

const academic: CommandHandler = () => ({
  output: [
    "Academic Information",
    "────────────────────────",
    "School : SMKN 1 Adiwerna",
    "Class  : XI TKJ 2",
    "Major  : Teknik Jaringan Komputer dan Telekomunikasi",
    "Year   : 2026/2027",
    "Term   : Ganjil",
  ],
});

/* ==================================================
   CLOEV COMMANDS
================================================== */

const schedule: CommandHandler = () => ({
  output: [
    "CLOEV Schedule",
    "────────────────────────",
    "Schedule simulator is ready.",
    "Detailed schedule integration will be added next.",
  ],
});

const tasks: CommandHandler = () => ({
  output: [
    "CLOEV Assignments",
    "────────────────────────",
    "Assignment integration is ready.",
    "Detailed assignment data will be added next.",
  ],
});

const members: CommandHandler = () => ({
  output: [
    "XI TKJ 2 Members",
    "────────────────────────",
    "Member data integration is ready.",
    "Use the Members page for the complete list.",
  ],
});

const picket: CommandHandler = () => ({
  output: [
    "Today's Picket",
    "────────────────────────",
    "Picket integration is ready.",
    "Detailed picket data will be added next.",
  ],
});

const weather: CommandHandler = () => ({
  output: [
    "CLOEV Weather",
    "────────────────────────",
    "Weather integration is ready.",
    "Use the dashboard Weather Card for current data.",
  ],
});

/* ==================================================
   COMMAND MAP
================================================== */

const commandMap: Record<
  string,
  CommandHandler
> = {
  help,
  clear,
  pwd,
  whoami,
  version,

  ls,
  cd,
  mkdir,
  rmdir,
  touch,
  cat,
  rm,
  cp,
  mv,
  tree,
  find,

  echo,
  head,
  tail,
  grep,
  wc,

  date,
  uname,

  history,

  account,
  academic,
  schedule,
  tasks,
  members,
  picket,
  weather,
};

/* ==================================================
   EXECUTE
================================================== */

export function executeCommand(
  input: string,
  context: CommandContext,
): CommandResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      output: [],
    };
  }

  const parts = trimmed.split(/\s+/);

  const command =
    parts[0].toLowerCase();

  const args = parts.slice(1);

  const handler =
    commandMap[command];

  if (!handler) {
    return {
      output: [
        `bash: ${command}: command not found`,
        'Type "help" to see available commands.',
      ],
    };
  }

  return handler(
    args,
    context,
  );
}
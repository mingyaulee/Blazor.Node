# Blazor.Node
[![Nuget](https://img.shields.io/nuget/v/Blazor.Node?style=flat-square&color=blue)](https://www.nuget.org/packages/Blazor.Node/)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/mingyaulee/Blazor.Node/Build?style=flat-square&color=blue)](https://github.com/mingyaulee/Blazor.Node/actions/workflows/Blazor.Node-Build.yml)
[![Sonar Quality Gate](https://img.shields.io/sonar/quality_gate/Blazor.Node?server=https%3A%2F%2Fsonarcloud.io&style=flat-square)](https://sonarcloud.io/dashboard?id=Blazor.Node)

Build a Node application that runs within Node.js with Blazor WebAssembly.

Why not build a dotnet console application instead?

Building a Node application with Blazor allows you to easily interop to the APIs provided by a Node package, in the Node environment.
One example is using the TypeScript API to parse or compile a TypeScript application using .Net code.

## How to use this package

> **Important for v0.\*.\*:**<br />
> This package is still in pre-release stage so the versioning does not comply with semantic versioning. Feature and bug fix increments the patch version and breaking change increments the minor version. So be sure to check the release note before upgrading between minor version.

1. Run `dotnet new --install Blazor.Node.Template`.
0. Run `dotnet new blazornode --name <ProjectName>` to initialize a new project with the template.
0. Change the working directory into the newly created project directory.
0. Run `dotnet run` to build and run the project.

> If you are using Visual Studio, you can do all these from the UI (once you have enabled showing .Net Core templates in the New project dialog).

# View-a-LOD
![image](https://github.com/Simon-Dirks/view-a-LOD/assets/2639851/712363a1-c3f2-4287-bfb4-0056019fabfb)

> [!WARNING]  
> This project is currently in early stage development, and not yet ready for production.

A **flexible and configurable Linked Open Data viewer** using SPARQL and Elastic endpoints, currently built on [Triply](https://triply.cc/) infrastructure.

This project is a collaboration between [Het Utrechts Archief](https://hetutrechtsarchief.nl/), [Regionaal Archief Zuid-Holland](https://www.razu.nl/) and [Kasteel Amerongen](https://www.kasteelamerongen.nl/), actively being developed by Simon Dirks (mail@simondirks.com).


## Adding endpoints

> [!NOTE]  
> This prototype requires an **elastic endpoint** for initial search hits (which are then asynchronously enriched using federated SPARQL requests). Out-of-the-box support for search through alternative means (e.g., direct SPARQL requests, existing APIs, ...) is on the roadmap.

Add/remove elastic and SPARQL endpoints in `src/app/config/settings.ts` (under `endpoints`):
https://github.com/Simon-Dirks/view-a-LOD/blob/75e448f9de69d023e08355c4ede51fba30acc4b1/src/app/config/settings.ts#L28-L39

## Dev

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.1.

Run `ng serve` for a dev server. Run `ng build` to build the project.

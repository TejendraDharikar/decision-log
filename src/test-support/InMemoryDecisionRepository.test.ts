// src/test-support/InMemoryDecisionRepository.test.ts
import { decisionRepositoryContract } from "./decisionRepositoryContract";
import { InMemoryDecisionRepository } from "./InMemmoryDecisionRepository";

decisionRepositoryContract("InMemory", async () => new InMemoryDecisionRepository());

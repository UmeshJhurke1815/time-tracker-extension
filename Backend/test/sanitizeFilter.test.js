import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";

test("countDocuments applies sanitizeFilter to nested query operators", async () => {
  const schema = new mongoose.Schema({
    extra: mongoose.Schema.Types.Mixed
  });
  const Model = mongoose.model("SanitizeFilterCountProbe", schema);

  let capturedFilter;
  Model.collection.countDocuments = async (filter) => {
    capturedFilter = filter;
    return 0;
  };

  const count = await Model.countDocuments(
    { extra: { $gt: "synthetic-value" } },
    { sanitizeFilter: true }
  );

  assert.equal(count, 0);
  assert.deepEqual(capturedFilter, {
    extra: { $eq: { $gt: "synthetic-value" } }
  });
});

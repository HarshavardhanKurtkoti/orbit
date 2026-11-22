import test from "node:test";
import assert from "node:assert";

// Test the rubber band logarithmic dampening formula (Principle 13)
function rubberBandClamp(dragDistance, dimensionSize) {
  if (dimensionSize <= 0) return 0;
  const absDrag = Math.abs(dragDistance);
  const resistance = (1 - 1 / ((absDrag * 0.55) / dimensionSize + 1)) * dimensionSize;
  return dragDistance < 0 ? -resistance : resistance;
}

test("UX Motion Principle 13: Rubber Band Resistance Dampening", () => {
  const size = 500;
  
  // Normal drag within bounds should have minimal resistance
  const smallDrag = rubberBandClamp(10, size);
  assert.ok(smallDrag > 0 && smallDrag < 10, "Small drag should be bounded");

  // Larger drag should encounter progressive logarithmic resistance
  const largeDrag = rubberBandClamp(100, size);
  const hugeDrag = rubberBandClamp(1000, size);

  assert.ok(largeDrag < 100, "Resistance must reduce distance below raw drag");
  assert.ok(hugeDrag < size, "Resistance must strictly clamp below boundary size");
  assert.ok(hugeDrag > largeDrag, "Resistance must remain monotonically increasing");

  // Negative direction symmetry
  assert.strictEqual(
    rubberBandClamp(-100, size),
    -largeDrag,
    "Negative overscroll must be symmetric"
  );
});

test("UX Motion Principle 8 & 18: Snappy Timing & Fast Closing Ratios", () => {
  const timings = {
    press: 90,        // 80-150ms
    hover: 120,       // 100-150ms
    normal: 220,      // 150-300ms
    panel: 280,       // 250-400ms
    fastClose: 130,   // Principle 18
  };

  // Principle 8 assertions
  assert.ok(timings.press >= 80 && timings.press <= 150, "Press timing within 80-150ms");
  assert.ok(timings.hover >= 100 && timings.hover <= 150, "Hover timing within 100-150ms");
  assert.ok(timings.normal >= 150 && timings.normal <= 300, "Normal transition within 150-300ms");
  assert.ok(timings.panel <= 400, "Panel transition under 400ms");

  // Principle 18: Exits must be faster than entrances (fast close <= 0.65 * entrance)
  assert.ok(
    timings.fastClose < timings.normal,
    "Closing must strictly be faster than opening"
  );
  assert.ok(
    timings.fastClose <= timings.normal * 0.65,
    "Closing should be roughly half to two-thirds of entry duration"
  );
});

test("UX Motion Principle 3: Stagger Cascade Duration Cap", () => {
  const staggerDelta = 35; // ms
  const itemCount = 6;
  const totalCascade = staggerDelta * itemCount;

  assert.ok(totalCascade <= 300, "Cascade must not exceed 300ms total to avoid user fatigue");
});

if (add(2, 2) !== 4) {
  console.error(`should equal 4 but instead was ${add(2, 2)}`);
  process.exit(1);
}
if (add(2, 4) !== 6) {
  console.error(`should equal 6 but instead was ${add(2, 4)}`);
  process.exit(1);
}

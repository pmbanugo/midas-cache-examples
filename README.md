# midas-cache-examples

Here's you'll find the sample app used to show how [midas-cache](https://github.com/pmbanugo/midas-cache) works, and its benchmark. The README in each project contains set up instructions.

Running the benchmark produces the following result:

```sh
hyperfine --warmup 1 'oha --no-tui -n 500 http://localhost:3000/records'
'oha --no-tui -n 500 http://localhost:3001/records'
'oha --no-tui -n 500 http://localhost:3003/records'
'oha --no-tui -n 500 http://localhost:3004/records'
```

Result:

```
Summary
  oha --no-tui -n 500 http://localhost:3003/records ran
    1.39 ± 1.90 times faster than oha --no-tui -n 500 http://localhost:3004/records
    3.76 ± 0.38 times faster than oha --no-tui -n 500 http://localhost:3000/records
   32.73 ± 3.42 times faster than oha --no-tui -n 500 http://localhost:3001/records
```

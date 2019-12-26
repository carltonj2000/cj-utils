# CJ Utils

This utils contains the program with processing images form taken from a camera
as follows.
Verify the support programs called out in the
[#Dependencies]
section are installed.

## Dependencies

The following programs need to be installed for the image conversion program
to work correclty.

- https://imagemagick.org/
  - expects the `convert` executable to be in `/usr/local/bin`.
- https://www.libraw.org/
  - expects the `simple_dcraw` executable to be in `/usr/local/bin`.

## History

Uses Electron And React In November 2019.

The code in this repository is based on the following videos.

- [Desktop App with Electron and React: Part 1 - Getting Started with Electron](https://www.youtube.com/watch?v=Cdu2O6o2DCg&t=43s)
- [Desktop App with Electron and React: Part 2 - Using React Router and Adding a Custom Icon](https://www.youtube.com/watch?v=8ZmpYiDoqO4)

Use hashroute not browser router because in build mode file are retrieved from
the file system.

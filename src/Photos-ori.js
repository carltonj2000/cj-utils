import React, { useState, useEffect } from "react";

const debug = false;

function Photos() {
  const { ipcRenderer } = window;
  const classes = useStyles();
  const [cwd, cwdSet] = useState("");
  const [error, errorSet] = useState(null);
  const [total, totalSet] = useState(0);
  const [jpegtotal, jpegtotalSet] = useState(0);
  const [extractRaw, extractRawSet] = useState(0);
  const [jpeg, jpegSet] = useState(0);
  const [convert, convertSet] = useState(0);
  const [resolution, resolutionSet] = useState("1620x1080");
  const [running, runningSet] = useState(false);

  useEffect(() => {
    const { ipcRenderer } = window;
    ipcRenderer.on("photos:set:dir", (_, item) => cwdSet(item));
    ipcRenderer.on("photos:error", (_, err) => {
      errorSet(err);
      runningSet(false);
    });
    ipcRenderer.on("photos:status:total", (_, ttl) => totalSet(ttl));
    ipcRenderer.on("photos:status:extractRaw", (_, er) => extractRawSet(er));
    ipcRenderer.on("photos:status:convert", (_, c) => convertSet(p => p + c));
    ipcRenderer.on("photos:status:jpeg", (_, j) => jpegSet(p => p + j));
    ipcRenderer.on("photos:status:jpegtotal", (_, jt) => jpegtotalSet(jt));
    ipcRenderer.on("photos:status:finished", () => runningSet(false));
    ipcRenderer.send("photos:gui:ready");
  }, []);

  const reset = (rning, clrTotal = true) => {
    if (clrTotal) totalSet(0);
    extractRawSet(0);
    convertSet(0);
    runningSet(rning);
    return true;
  };
  const onSelectDirectory = _ => ipcRenderer.send("photos:get:dir");
  const onReset = _ => reset(false) && ipcRenderer.send("photos:reset", cwd);
  const onProcess = _ =>
    reset(true, false) && ipcRenderer.send("photos:process", cwd, resolution);
  const onClearError = _ => errorSet(null);

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h4" component="h2">
          Photo Processing
        </Typography>
      </CardContent>
      <CardActions>
        <Grid container className={classes.grid} spacing={1}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={onSelectDirectory}
            >
              Change Selected Directory
            </Button>
            <Typography
              className={classes.noNewLine}
              color="secondary"
              component="span"
            >
              {cwd}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={onProcess}>
              Process Photos
            </Button>
            {debug ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={onReset}
                className={classes.resetBtn}
              >
                Reset
              </Button>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="resolution">Resolution</InputLabel>
              <Select
                value={resolution}
                onChange={e =>
                  console.log(e.target) || resolutionSet(e.target.value)
                }
                input={<Input name="resolution" id="resolution" />}
                autoWidth
              >
                <MenuItem value="1024x768">1024x768</MenuItem>
                <MenuItem value="1620x1080">1620x1080</MenuItem>
                <MenuItem value="1920x1280">1920x1280</MenuItem>
              </Select>
            </FormControl>
            {running ? <CircularProgress className={classes.progress} /> : null}
          </Grid>
          <Grid item xs={12}>
            {jpegtotal ? (
              <Typography color="primary">
                JPEG resized: {jpeg} / {jpegtotal}
              </Typography>
            ) : null}
            {total ? (
              <Typography color="primary">
                RAW Extracted: {extractRaw} / {total}, resized: {convert} /{" "}
                {total}
              </Typography>
            ) : null}
          </Grid>
          <Grid item>
            {error ? (
              <Typography color="secondary" variant="h6" component="h6">
                {error}
              </Typography>
            ) : null}
            {error && (
              <Button size="small" color="secondary" onClick={onClearError}>
                Clear Error
              </Button>
            )}
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default Photos;

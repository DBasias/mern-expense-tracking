import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Typography } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import auth from "../auth/auth-helper";
import { currentMonthPreview } from "./api-expense";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 800,
    margin: "auto",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  title2: {
    padding: `32px ${theme.spacing(2.5)}px 2px`,
    color: "#2bbd7e",
  },
  totalSpent: {
    padding: "50px 40px",
    fontSize: "4em",
    margin: 20,
    marginBottom: 30,
    backgroundColor: "#01579b",
    color: "#70f0ae",
    textAlign: "center",
    borderRadius: "50%",
    border: "10px double #70f0ae",
    fontWeight: 300,
  },
  categorySection: {
    padding: 25,
    paddingTop: 16,
    margin: "auto",
  },
  catDiv: {
    height: "4px",
    margin: "0",
    marginBottom: 8,
  },
  val: {
    width: 200,
    display: "inline-table",
    textAlign: "center",
    margin: 2,
  },
  catTitle: {
    display: "inline-block",
    padding: 10,
    backgroundColor: "#f4f6f9",
  },
  catHeading: {
    color: "#6b6b6b",
    fontSize: "1.15em",
    backgroundColor: "#f7f7f7",
    padding: "4px 0",
  },
  spent: {
    margin: "16px 10px 10px 0",
    padding: "10px 30px",
    border: "4px solid #58bd7f38",
    borderRadius: "0.5em",
  },
  day: {
    fontSize: "0.9em",
    fontStyle: "italic",
    color: "#696969",
  },
}));

export default function ExpenseOverview() {
  const classes = useStyles();
  const [redirectToSignIn, setRedirectToSignIn] = useState(false);
  const [expensePreview, setExpensePreview] = useState({
    month: 0,
    today: 0,
    yesterday: 0,
  });

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    currentMonthPreview({ t: jwt.token }, signal).then(data => {
      if (data.error) {
        setRedirectToSignIn(true);
      } else {
        setExpensePreview(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  if (redirectToSignIn) {
    return <Redirect to="/signin" />;
  }

  return (
    <Card className={classes.card}>
      <Typography
        variant="h4"
        className={classes.title2}
        color="textPrimary"
        style={{ textAlign: "center" }}
      >
        You've spent
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography component="span" className={classes.totalSpent}>
          ${expensePreview.month ? expensePreview.month.totalSpent : "0"}{" "}
          <span style={{ display: "block", fontSize: "0.3em" }}>
            so far this month
          </span>
        </Typography>
        <div style={{ margin: "20px 20px 20px 30px" }}>
          <Typography variant="h5" className={classes.spent} color="primary">
            ${expensePreview.today ? expensePreview.today.totalSpent : "0"}{" "}
            <span className={classes.day}>today</span>
          </Typography>
          <Typography variant="h5" className={classes.spent} color="primary">
            $
            {expensePreview.yesterday
              ? expensePreview.yesterday.totalSpent
              : "0"}{" "}
            <span className={classes.day}>yesterday </span>
          </Typography>
          <Link to="/expenses/all">
            <Typography variant="h6">See more</Typography>
          </Link>
        </div>
      </div>
    </Card>
  );
}

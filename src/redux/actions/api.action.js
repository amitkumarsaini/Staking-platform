

import { apiCallGet, apiCallPost } from "../../services/axios";
import { APIURL } from "../constants";

export function getCoins(data) {
    return (dispatch) =>
        new Promise((resolve, reject) => {
            apiCallPost(
                APIURL.GETALLCOINS,
                data,
                {},
                true,
                true
            )
                .then((result) => {
                    resolve(result);
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
}

export function getBets(data, loader) {
    return (dispatch) =>
        new Promise((resolve, reject) => {
            apiCallPost(
                `${APIURL.GETALLBETS}`,
                data,
                {},
                true,
                loader
            )
                .then((result) => {
                    resolve(result);
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
}

export function getRewardsRanks() {
    return (dispatch) =>
        new Promise((resolve, reject) => {
            apiCallGet(
                `${APIURL.GETRANKS}`,
                {},
                true,
                true
            )
                .then((result) => {
                    resolve(result);
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
}

export function getRewardsRanksMonthly() {
    return (dispatch) =>
        new Promise((resolve, reject) => {
            apiCallGet(
                `${APIURL.GETRANKSMONTHLY}`,
                {},
                true,
                true
            )
                .then((result) => {
                    resolve(result);
                })
                .catch((ex) => {
                    reject(ex);
                });
        });
}
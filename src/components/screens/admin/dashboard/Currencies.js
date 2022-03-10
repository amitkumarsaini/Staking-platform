import React, { useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ButtonCustom from "../../../common/buttonCustom/ButtonCustom";
import HeaderAdmin from "../../../common/HeaderAdmin/HeaderAdmin";
import { getIndividualCoins, changeCoinStatus } from "../actions/coins";
import { Form } from "react-bootstrap";
import AddCurrencies from "../AddCurrencies";

const Currencies = () => {
  const { coin, type, plan, index } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [updateComponent, showUpdateComponent] = useState(false);
  const [currentComponent, setcurrentComponent] = useState({});
  const [action, setaction] = useState("");
  const coins = useSelector((state) => state.coins.coins);

  const resetComponent = () => {
    showUpdateComponent(!updateComponent);
    setcurrentComponent({});
    setaction("");
  };

  useEffect(() => {
    if (location.pathname !== "/admin/dashboard") {
      dispatch(getIndividualCoins(coin, type));
    }
  }, [location.pathname, dispatch, coin, type, plan, index]);

  const changeStatus = (index) => {
    coins.map(async (elem, i) => {
      if (index === i) {
        dispatch(changeCoinStatus(coin, type, elem, index));
      }
    });
  };

  const editOracle = (elem) => {
    setcurrentComponent(elem);
    showUpdateComponent(!updateComponent);
    setaction("Edit");
  };

  const addOracle = (elem) => {
    showUpdateComponent(!updateComponent);
    setcurrentComponent({});
    setaction("Add");
  };

  const getType = (index) => {
    if (index === "1") {
      return "Chainlink";
    } else if (index === "2") {
      return "Uniswap";
    }
  };

  return !updateComponent ? (
    <Container className="table_style" fluid>
      {coin || type || plan !== undefined ? (
        <>
          <HeaderAdmin
            title={`Set ${coin} ${type ? type : ""} ${plan ? plan : ""} ${
              index !== undefined ? "index" : ""
            } coins`}
          >
            <ButtonCustom onClick={() => addOracle()} title="Add Currency" />
          </HeaderAdmin>
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Symbol</th>
                <th>Contract Address</th>
                <th>Oracle Type</th>
                <th>Status</th>
                {/* <th></th> */}
              </tr>
            </thead>
            <tbody>
              {coins.map((elem, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{elem.symbol}</td>
                  <td>{elem.address}</td>
                  <td>{getType(elem.oracleType)}</td>
                  <td>
                    <Form.Check
                      type="switch"
                      label=""
                      onChange={(e) => changeStatus(index)}
                      checked={elem.status}
                    />
                  </td>
                  <td>
                    <ButtonCustom
                      onClick={() => editOracle(elem)}
                      title="Edit"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <div className="admin_dashboard_home">
          <h2>Home Dashboard Content</h2>
        </div>
      )}
    </Container>
  ) : (
    <AddCurrencies
      coin={coin}
      type={type}
      plan={plan}
      index={index}
      resetComponent={() => resetComponent}
      currentComponent={currentComponent}
      action={action}
    />
  );
};

export default Currencies;

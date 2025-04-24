import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import "../css/Complain.css";

//data type for nama depan, nama belakang, email, and option
interface IFormField {
  namaDepan: string;
  namaBelakang: string;
  email: string;
  option: string;
}

// main function
function ComplainPage() {
  // set sentsuccess to false because send button is not clicked yet
  const [sentSuccess, setSentSuccess] = useState(false);

  // set initial option to "general" in topic. when the other radio button is clicked, the "general" radio button will unclick
  const form = useForm<IFormField>({
    defaultValues: { option: "general" },
    mode: "onChange",
  });

  //check for any error or validation. isDirty : when input has been edited, isDirty will be set to true, otherwise false. isValid : if there is no error in input, then isValid will be set to true, otherwise false.
  const {
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
  } = form;

  // set sent success to true if success when submitting form
  const onSubmit: SubmitHandler<IFormField> = (data) => {
    try {
      setSentSuccess(true);
    } catch (error) {
      alert("Failed to send the data");
    }
  };

  // console log to test if the errors or validation are handled properly
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  // generate random ticket number
  const [randnum] = useState(Math.floor(Math.random() * 100000).toString());

  return (
    <div className='contain'>
      <div className='wrap'>
        <div className='judul'>Support Ticket Form</div>
        <br />
        <hr />
        {sentSuccess ? (
          <div className='seperator'>
            <div className='thank-m'>
              Thank you for sending us your report. We will track the problem
              now
            </div>
            <br />
            <br />
            <div className='ticket-num'>Ticket Number : {randnum}</div>
          </div>
        ) : (
          <form name='myform' onSubmit={handleSubmit(onSubmit)}>
            <div className='pemisah-send-dan-input'></div>
            <div className='pemisah'>
              <div className='name-email-topic'>
                <div className='nama'>
                  Nama<mark className='red'>*</mark>
                </div>
                <div className='inputNama'>
                  <div className='namaPertama'>
                    <input
                      type='text'
                      id='input-nama'
                      {...register("namaDepan", {
                        required: "Isi Nama Depan",
                      })}
                      aria-invalid={errors.namaDepan ? "true" : "false"}
                    />
                    <label>First</label>
                    {errors.namaDepan && (
                      <small role='alert'>{errors.namaDepan.message}</small>
                    )}
                  </div>
                  <div className='namaKedua'>
                    <input
                      type='text'
                      id='input-nama-belakang'
                      {...register("namaBelakang", {
                        required: "Isi Nama Belakang",
                      })}
                      aria-invalid={errors.namaBelakang ? "true" : "false"}
                    />
                    <label>Last</label>
                    {errors.namaBelakang && (
                      <small role='alert'>{errors.namaBelakang.message}</small>
                    )}
                  </div>
                </div>
                <div className='email'>
                  Email<mark className='red'>*</mark>
                </div>
                <div className='inputEmail'>
                  <input
                    type='text'
                    id='email-inp'
                    {...register("email", {
                      required: "Isi Email!",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Email tidak valid!",
                      },
                    })}
                    aria-invalid={errors.email ? "true" : "false"}
                  />
                  {errors.email && (
                    <small role='alert'>{errors.email.message}</small>
                  )}
                </div>
                <div className='pemisah-topic'>
                  <div className='topic'>
                    topic<mark className='red'>*</mark>
                  </div>
                  <div className='box-choose'>
                    <div className='text-choose'>
                      What can we help you today?
                    </div>
                    <div className='choose-but'>
                      <div className='general-choose'>
                        <input
                          type='radio'
                          id='generalradio'
                          value={"general"}
                          {...register("option")}
                        />
                        <div className='general-text'>General</div>
                      </div>
                      <div className='bug-choose'>
                        <input
                          type='radio'
                          id='bugradio'
                          value={"bug"}
                          {...register("option")}
                        />
                        <div className='bug-text'>Bug</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='desc'>
                <div className='desc-text'>Description (Optional)</div>
                <div className='box-desc'>
                  <textarea
                    id='desc-input'
                    placeholder='Description report'
                    rows={12}
                    cols={25}
                  />
                </div>
              </div>
            </div>
            <div className='send'>
              <span className=''></span>
              <button
                className={!isDirty || !isValid ? "send-grey" : "send-but"}
                type='submit'
                disabled={!isDirty || !isValid}
              >
                SEND
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ComplainPage;
